export interface Property {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  installment: string;
}

export interface Developer {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  developerPhotoUrl: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseGetAllDeveloper {
  status: {
    code: number;
    message: string;
  };
  data: {
    developers: Developer[];
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  sorting: {
    sortBy: string;
    sortDir: string;
  };
}

export interface ResponseGetDeveloperById {
  status: {
    code: number;
    message: string;
  };
  data: {
    developer: Developer;
  };
}

export interface PayloadDeveloper {
  name: string;
  description: string;
  isDeleted?: boolean;
  createdBy: number;
  updatedBy: number;
  developerPhotoUrl: File;
}

export interface PayloadUpdateDeveloper
  extends Omit<PayloadDeveloper, "developerPhotoUrl"> {
  id: number;
  developerPhotoUrl?: File;
}
