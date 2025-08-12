export interface Property {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  installment: string;
}

export interface Developer {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  properties: Property[];
}