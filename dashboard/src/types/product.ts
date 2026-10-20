interface ProductImage {
    url: string;
    cloudinaryid: string;
}

export interface Product {
    id: string;
    title: string;
    originalPrice: number;
    finalPrice: number;
    discount: number;
    categories: { id: string; name: string }[] | string;
    stock: number;
    buys: number;
    description: string;
    thumbnail: ProductImage;
    productImages: ProductImage[];
}