export interface FavoriteProperty {
  propertyId: number;
  favoriteId: number;
  location: string;
  price: string;
  name: string;
  createdAt: string;
  clusterId: number;
  developerId: number;
  developer: string;
  clusterTypeName: string;
  kamarTidur: number;
  kamarMandi: number;
  buildingArea: number;
  landArea: number;
  propertyPhoto: string | null;
}

export interface AddFavoriteRequest {
  userId: number;
  propertyId: number;
}

export interface FavoriteResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    properties: FavoriteProperty[];
  };
}

export interface AddFavoriteResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    favoriteProperty: {
      id: number;
      userId: number;
      propertyId: number;
    };
  };
}