export interface FRDevice {
  connected: boolean;
  shortName: string;
  fullName: string;

  // These are computed
  isSelected?: boolean;
}

export interface PostData {
  type: "raw";
  rows?: string[][];
  parts?: string[];
}
