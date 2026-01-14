import { useState, useMemo, useCallback } from 'react';
import {
  CodePreview,
  Button,
  Input,
  Textarea,
  Select,
  Tabs,
  TabPanel,
  Badge,
} from '../shared';
import { AiAssistBanner } from '../ai';
import { generateJsonLd, generateFaqSchema } from '@/lib/seo-tools/services';
import { SCHEMA_TYPES, SCHEMA_CATEGORIES } from '@/lib/seo-tools/constants';
import type { SchemaData } from '@/lib/seo-tools/types';

type SchemaTypeId = 'Article' | 'Product' | 'Organization' | 'Person' | 'LocalBusiness' | 'FAQPage' | 'BreadcrumbList';

interface SchemaFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'array';
  required?: boolean;
  placeholder?: string;
  description?: string;
}

const SCHEMA_FIELDS: Record<SchemaTypeId, SchemaFieldConfig[]> = {
  Article: [
    { name: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'Article title' },
    { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Brief description' },
    { name: 'image', label: 'Image URL', type: 'url', required: true, placeholder: 'https://example.com/image.jpg' },
    { name: 'datePublished', label: 'Date Published', type: 'date', required: true },
    { name: 'dateModified', label: 'Date Modified', type: 'date' },
    { name: 'authorName', label: 'Author Name', type: 'text', required: true },
    { name: 'authorUrl', label: 'Author URL', type: 'url' },
    { name: 'publisherName', label: 'Publisher Name', type: 'text', required: true },
    { name: 'publisherLogo', label: 'Publisher Logo URL', type: 'url', required: true },
  ],
  Product: [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image URL', type: 'url', required: true },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'sku', label: 'SKU', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'priceCurrency', label: 'Currency', type: 'text', placeholder: 'USD' },
    { name: 'availability', label: 'Availability', type: 'text', placeholder: 'InStock, OutOfStock, or PreOrder' },
    { name: 'ratingValue', label: 'Rating (1-5)', type: 'number' },
    { name: 'reviewCount', label: 'Review Count', type: 'number' },
  ],
  Organization: [
    { name: 'name', label: 'Organization Name', type: 'text', required: true },
    { name: 'url', label: 'Website URL', type: 'url', required: true },
    { name: 'logo', label: 'Logo URL', type: 'url' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'telephone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ],
  Person: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'url', label: 'Website URL', type: 'url' },
    { name: 'image', label: 'Photo URL', type: 'url' },
    { name: 'jobTitle', label: 'Job Title', type: 'text' },
    { name: 'worksFor', label: 'Works For', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
  ],
  LocalBusiness: [
    { name: 'name', label: 'Business Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image URL', type: 'url' },
    { name: 'telephone', label: 'Phone', type: 'text' },
    { name: 'streetAddress', label: 'Street Address', type: 'text', required: true },
    { name: 'addressLocality', label: 'City', type: 'text', required: true },
    { name: 'addressRegion', label: 'State/Region', type: 'text', required: true },
    { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
    { name: 'addressCountry', label: 'Country', type: 'text', required: true },
    { name: 'priceRange', label: 'Price Range', type: 'text', placeholder: '$$' },
  ],
  FAQPage: [
    { name: 'faqItems', label: 'FAQ Items', type: 'array', required: true },
  ],
  BreadcrumbList: [
    { name: 'breadcrumbs', label: 'Breadcrumb Items', type: 'array', required: true },
  ],
};

export function SchemaGenerator() {
  const [selectedType, setSelectedType] = useState<SchemaTypeId>('Article');
  const [formData, setFormData] = useState<SchemaData>({});
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' },
  ]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; url: string }[]>([
    { name: '', url: '' },
  ]);
  const [activeTab, setActiveTab] = useState('form');
  const [aiGeneratedSchema, setAiGeneratedSchema] = useState<string | null>(null);

  // Handle AI-generated schema output
  const handleAiGenerate = useCallback((result: string) => {
    // Try to extract JSON from the result (AI might include extra text)
    let jsonStr = result;
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    try {
      // Validate it's valid JSON
      JSON.parse(jsonStr);
      setAiGeneratedSchema(jsonStr);
      setActiveTab('preview');
    } catch {
      // If parsing fails, store as-is and let user see it
      setAiGeneratedSchema(result);
      setActiveTab('preview');
    }
  }, []);

  // Clear AI-generated schema when user makes manual changes
  const clearAiSchema = useCallback(() => {
    setAiGeneratedSchema(null);
  }, []);

  // Build schema output
  const schemaOutput = useMemo(() => {
    if (selectedType === 'FAQPage') {
      const validItems = faqItems.filter((i) => i.question && i.answer);
      if (validItems.length === 0) return null;
      return generateFaqSchema(validItems);
    }

    if (selectedType === 'BreadcrumbList') {
      const validItems = breadcrumbs.filter((i) => i.name && i.url);
      if (validItems.length === 0) return null;
      return generateJsonLd('BreadcrumbList', {
        itemListElement: validItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      });
    }

    // Build schema data based on type
    const data: SchemaData = { ...formData };

    // Handle nested structures
    if (selectedType === 'Article') {
      if (data.authorName) {
        data.author = {
          '@type': 'Person',
          name: data.authorName,
          url: data.authorUrl,
        };
        delete data.authorName;
        delete data.authorUrl;
      }
      if (data.publisherName) {
        data.publisher = {
          '@type': 'Organization',
          name: data.publisherName,
          logo: data.publisherLogo
            ? { '@type': 'ImageObject', url: data.publisherLogo }
            : undefined,
        };
        delete data.publisherName;
        delete data.publisherLogo;
      }
    }

    if (selectedType === 'Product') {
      if (data.price) {
        data.offers = {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.priceCurrency || 'USD',
          availability: data.availability
            ? `https://schema.org/${data.availability}`
            : undefined,
        };
        delete data.price;
        delete data.priceCurrency;
        delete data.availability;
      }
      if (data.ratingValue && data.reviewCount) {
        data.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: data.ratingValue,
          reviewCount: data.reviewCount,
        };
        delete data.ratingValue;
        delete data.reviewCount;
      }
      if (data.brand) {
        data.brand = { '@type': 'Brand', name: data.brand };
      }
    }

    if (selectedType === 'LocalBusiness') {
      data.address = {
        '@type': 'PostalAddress',
        streetAddress: data.streetAddress,
        addressLocality: data.addressLocality,
        addressRegion: data.addressRegion,
        postalCode: data.postalCode,
        addressCountry: data.addressCountry,
      };
      delete data.streetAddress;
      delete data.addressLocality;
      delete data.addressRegion;
      delete data.postalCode;
      delete data.addressCountry;
    }

    if (selectedType === 'Person' && data.worksFor) {
      data.worksFor = { '@type': 'Organization', name: data.worksFor };
    }

    return generateJsonLd(selectedType, data);
  }, [selectedType, formData, faqItems, breadcrumbs]);

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAiGeneratedSchema(null); // Clear AI schema on manual edit
  }, []);

  const handleTypeChange = useCallback((type: SchemaTypeId) => {
    setSelectedType(type);
    setFormData({});
    setFaqItems([{ question: '', answer: '' }]);
    setBreadcrumbs([{ name: '', url: '' }]);
    setAiGeneratedSchema(null); // Clear AI schema on type change
  }, []);

  const handleAddFaqItem = useCallback(() => {
    setFaqItems((prev) => [...prev, { question: '', answer: '' }]);
  }, []);

  const handleUpdateFaqItem = useCallback(
    (index: number, field: 'question' | 'answer', value: string) => {
      setFaqItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      );
      setAiGeneratedSchema(null);
    },
    []
  );

  const handleRemoveFaqItem = useCallback((index: number) => {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddBreadcrumb = useCallback(() => {
    setBreadcrumbs((prev) => [...prev, { name: '', url: '' }]);
  }, []);

  const handleUpdateBreadcrumb = useCallback(
    (index: number, field: 'name' | 'url', value: string) => {
      setBreadcrumbs((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      );
      setAiGeneratedSchema(null);
    },
    []
  );

  const handleRemoveBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fields = SCHEMA_FIELDS[selectedType] || [];

  const tabs = [
    { id: 'form', label: 'Form' },
    { id: 'preview', label: 'JSON-LD Preview' },
    { id: 'script', label: 'Script Tag' },
  ];

  const typeOptions = SCHEMA_TYPES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div className="space-y-6">
      {/* AI Assist Banner */}
      <AiAssistBanner tool="schema" onGenerate={handleAiGenerate} />

      {/* Schema Type Selector */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          label="Schema Type"
          options={typeOptions}
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value as SchemaTypeId)}
          className="w-64"
        />
        <div className="text-sm text-gray-600">
          {SCHEMA_TYPES.find((t) => t.id === selectedType)?.description}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Fill in the details</h3>

          {/* FAQ Items */}
          {selectedType === 'FAQPage' && (
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Question {index + 1}
                    </span>
                    {faqItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFaqItem(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    value={item.question}
                    onChange={(e) =>
                      handleUpdateFaqItem(index, 'question', e.target.value)
                    }
                    placeholder="Enter question..."
                  />
                  <Textarea
                    value={item.answer}
                    onChange={(e) =>
                      handleUpdateFaqItem(index, 'answer', e.target.value)
                    }
                    placeholder="Enter answer..."
                  />
                </div>
              ))}
              <Button variant="outline" onClick={handleAddFaqItem}>
                Add Question
              </Button>
            </div>
          )}

          {/* Breadcrumb Items */}
          {selectedType === 'BreadcrumbList' && (
            <div className="space-y-4">
              {breadcrumbs.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Item {index + 1}
                    </span>
                    {breadcrumbs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBreadcrumb(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateBreadcrumb(index, 'name', e.target.value)
                    }
                    placeholder="Page name..."
                  />
                  <Input
                    value={item.url}
                    onChange={(e) =>
                      handleUpdateBreadcrumb(index, 'url', e.target.value)
                    }
                    placeholder="https://example.com/page"
                  />
                </div>
              ))}
              <Button variant="outline" onClick={handleAddBreadcrumb}>
                Add Breadcrumb
              </Button>
            </div>
          )}

          {/* Regular Fields */}
          {selectedType !== 'FAQPage' && selectedType !== 'BreadcrumbList' && (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  {field.type === 'textarea' ? (
                    <Textarea
                      label={
                        field.label + (field.required ? ' *' : '')
                      }
                      value={(formData[field.name] as string) || ''}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <Input
                      label={
                        field.label + (field.required ? ' *' : '')
                      }
                      type={
                        field.type === 'url'
                          ? 'url'
                          : field.type === 'email'
                            ? 'email'
                            : field.type === 'number'
                              ? 'number'
                              : field.type === 'date'
                                ? 'date'
                                : 'text'
                      }
                      value={(formData[field.name] as string) || ''}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <TabPanel isActive={activeTab === 'form'} className="pt-4">
            <div className="text-center py-8 text-gray-500">
              Select the "JSON-LD Preview" or "Script Tag" tab to see the output.
            </div>
          </TabPanel>

          <TabPanel isActive={activeTab === 'preview'} className="pt-4">
            {aiGeneratedSchema ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <span>&#10024;</span>
                  <span>AI Generated</span>
                  <button
                    onClick={clearAiSchema}
                    className="text-gray-500 hover:text-gray-700 text-xs underline ml-auto"
                  >
                    Clear
                  </button>
                </div>
                <CodePreview
                  code={aiGeneratedSchema}
                  language="json"
                  filename="schema.json"
                  showDownload={true}
                />
              </div>
            ) : schemaOutput ? (
              <CodePreview
                code={schemaOutput.json}
                language="json"
                filename="schema.json"
                showDownload={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Fill in the required fields to generate schema markup.
              </div>
            )}
          </TabPanel>

          <TabPanel isActive={activeTab === 'script'} className="pt-4">
            {aiGeneratedSchema ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <span>&#10024;</span>
                  <span>AI Generated</span>
                  <button
                    onClick={clearAiSchema}
                    className="text-gray-500 hover:text-gray-700 text-xs underline ml-auto"
                  >
                    Clear
                  </button>
                </div>
                <CodePreview
                  code={`<script type="application/ld+json">\n${aiGeneratedSchema}\n</script>`}
                  language="html"
                  filename="schema.html"
                  showDownload={true}
                />
              </div>
            ) : schemaOutput ? (
              <CodePreview
                code={schemaOutput.scriptTag}
                language="html"
                filename="schema.html"
                showDownload={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Fill in the required fields to generate the script tag.
              </div>
            )}
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
