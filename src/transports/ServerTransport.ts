// Marker interface
export interface ServerTransport {}

// Functional transport interface extending marker
export interface ConnectableServerTransport extends ServerTransport {
  connect(): Promise<void>;
}
