document.addEventListener('DOMContentLoaded', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = document.getElementById('network');
    
    if (!svg) {
        console.error('Network SVG element not found');
        return;
    }
    
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Speed factor constant (adjust this to change overall animation speed)
    const SPEED_FACTOR = 0.5; // Slower, more gentle animation

    const botNames = ['ChatGPT', 'LLama', 'Gemini', 'DeepSeek', 'Qwen', 'Claude'];
    const sourceNames = [
        'Wikipedia', 'YouTube', 'Facebook', 'X/Twitter', 'Academic Papers', 
        'News Sites', 'Books Dataset', 'Official Website', 'Podcasts',
        'Reviews Website', 'Reddit', 
        'Forums', 'Blogs', 
        'Public Databases',
        'Market Reports', 'Industry Whitepapers', 'Technical Documentation'
    ];

    const nodes = [];
    const links = [];

    function updatePositions() {
        nodes.forEach(node => {
            gsap.to(node, {
                x: Math.random() * width,
                y: Math.random() * height,
                duration: 30 / SPEED_FACTOR,
                ease: "none",
                onUpdate: updateNodePosition,
                onUpdateParams: [node]
            });
        });
    }

    function updateNodePosition(node) {
        const group = node.element;
        group.setAttribute('transform', `translate(${node.x}, ${node.y})`);

        links.forEach(link => {
            if (link.source === node || link.target === node) {
                const line = link.element;
                if (link.source === node) {
                    line.setAttribute('x1', node.x);
                    line.setAttribute('y1', node.y);
                }
                if (link.target === node) {
                    line.setAttribute('x2', node.x);
                    line.setAttribute('y2', node.y);
                }
            }
        });
    }

    // Gentle glow animation
    function animateGlow() {
        gsap.to('.node.bot', {
            stroke: 'rgba(147, 197, 253, 0.5)',  // Soft blue glow
            strokeWidth: 2,
            duration: 4 / SPEED_FACTOR,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        gsap.to('.node.source', {
            stroke: 'rgba(255, 255, 255, 0.3)',
            strokeWidth: 1.5,
            duration: 5 / SPEED_FACTOR,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        // Animate link opacity for subtle pulse effect
        gsap.to('.link', {
            opacity: 0.2,
            duration: 3 / SPEED_FACTOR,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.2
        });
    }
    

    // Create and animate data particles
    function createDataParticle() {
        if (links.length === 0) {
            setTimeout(createDataParticle, (1000) / SPEED_FACTOR);
            return;
        }

        const link = links[Math.floor(Math.random() * links.length)];

        if (!link || !link.source || !link.target || !link.source.type || !link.target.type) {
            setTimeout(createDataParticle, (100) / SPEED_FACTOR);
            return;
        }

        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', 2);
        particle.setAttribute('class', 'data-particle');
        particle.setAttribute('opacity', '0.5');
        svg.appendChild(particle);

        const duration = (Math.random() * 3 + 5) / SPEED_FACTOR;

        const sourceNode = link.source.type === 'source' ? link.source : link.target;
        const botNode = link.source.type === 'bot' ? link.source : link.target;

        gsap.to(particle, {
            duration: duration,
            ease: "none",
            onUpdate: function() {
                const progress = this.progress();
                const currentX = sourceNode.x + (botNode.x - sourceNode.x) * progress;
                const currentY = sourceNode.y + (botNode.y - sourceNode.y) * progress;
                particle.setAttribute('cx', currentX);
                particle.setAttribute('cy', currentY);
            },
            onComplete: () => {
                // Add glow effect to the target node
                triggerNodeGlow(botNode);
                particle.remove();
                createDataParticle();
            }
        });
    }

    // Trigger glow effect on node
    function triggerNodeGlow(node) {
        const circle = node.element.querySelector('circle');
        if (circle) {
            circle.classList.add('node-glow');
            setTimeout(() => {
                circle.classList.remove('node-glow');
            }, 1000); // 1 second glow duration
        }
    }

    // Create multiple data particles
    function initializeParticles() {
        for (let i = 0; i < 12; i++) {  // Fewer particles for cleaner look
            setTimeout(createDataParticle, (Math.random() * 5000) / SPEED_FACTOR);
        }
    }

    // Initialize nodes and links
    function initializeNetwork() {
        // Create bot nodes
        botNames.forEach((name, index) => {
            nodes.push({
                id: `bot-${index}`,
                name: name,
                type: 'bot',
                x: Math.random() * width,
                y: Math.random() * height
            });
        });

        // Create source nodes
        sourceNames.forEach((name, index) => {
            nodes.push({
                id: `source-${index}`,
                name: name,
                type: 'source',
                x: Math.random() * width,
                y: Math.random() * height
            });
        });

        // Clear links array
        links.length = 0;

        const botNodes = nodes.filter(n => n.type === 'bot');
        const sourceNodes = nodes.filter(n => n.type === 'source');

        // For each bot node, connect to at least one source node
        botNodes.forEach(botNode => {
            const numConnections = Math.floor(Math.random() * 3) + 1; // 1 to 3 connections
            const shuffledSources = [...sourceNodes].sort(() => 0.5 - Math.random());
            for (let i = 0; i < numConnections && i < shuffledSources.length; i++) {
                links.push({
                    source: botNode,
                    target: shuffledSources[i]
                });
            }
        });

        // Ensure each source node is connected to at least one bot node
        sourceNodes.forEach(sourceNode => {
            const isConnected = links.some(link => link.target === sourceNode);
            if (!isConnected) {
                const randomBot = botNodes[Math.floor(Math.random() * botNodes.length)];
                links.push({
                    source: randomBot,
                    target: sourceNode
                });
            }
        });

        // Render nodes and links
        renderNetwork();

        // Start animations
        updatePositions();
        setInterval(updatePositions, 30000 / SPEED_FACTOR);
        animateGlow();
        initializeParticles();
    }

    // Render the network
    function renderNetwork() {
        // Render links
        links.forEach(link => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'link');
            svg.appendChild(line);
            link.element = line;
        });

        // Render nodes
        nodes.forEach(node => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', node.type === 'bot' ? 8 : 6);
            circle.setAttribute('class', `node ${node.type}`);
            group.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('y', 18);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'node-label');
            text.textContent = node.name;
            group.appendChild(text);

            svg.appendChild(group);

            node.element = group;
        });

        // Initial position update
        nodes.forEach(updateNodePosition);
    }

    // Initialize the network
    initializeNetwork();
});