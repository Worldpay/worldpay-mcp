// This is based off: https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result

// Shared annotation metadata structure
export interface ContentAnnotations {
  audience?: string | string[];
  priority?: number; // higher = more important
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
  expiresAt?: string; // ISO 8601
}

// Base shape for any content type
interface BaseContent<MCPType extends string> {
  type: MCPType;
  annotations?: ContentAnnotations;
}

// Specific content variants
export interface TextContent extends BaseContent<'text'> {
  text: string;
}

export interface ImageContent extends BaseContent<'image'> {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface AudioContent extends BaseContent<'audio'> {
  url: string;
  durationSeconds?: number;
  waveform?: number[];
}

export interface ResourceLinksContent extends BaseContent<'links'> {
  links: Array<{
    href: string;
    title?: string;
    rel?: string;
  }>;
}

// Union of all content items
export type ContentItem =
  | TextContent
  | ImageContent
  | AudioContent
  | ResourceLinksContent

export type ContentCollection = ContentItem[];
