export interface CategoryModel {
  category: string;
  id: number;
  offers: [
    {
      description: string;
      id: number;
      photo: string;
      price: number;
      title: string;
    }
  ];
}
