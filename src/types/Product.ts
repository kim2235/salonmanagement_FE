export interface Product {
    id: string | number;
    name: string;
    shortDescription: string;
    category: string;
    description: string;
    created_at: string;
    thumbnail: string; // URL or base64 string of the thumbnail
    supplier: string;
    stockQuantity: number;
    stockQuantityUsed?: number;
    stockQuantityRemaining?: number;
    trackStock: boolean;
    lowStockQuantity: number;
    reorderQuantity: number;
    measurementUnit: string;
    measurementAmount: number;
}


