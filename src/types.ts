
export interface RequestConfig {
    method: string;
    url: string;
    body: any;
  }
  
  export interface SavedRequest extends RequestConfig {
    name: string;
    timestamp: number;
  }
  
  export type ViewMode = 'json' | 'curl';
  export type TabMode = 'endpoints' | 'saved';