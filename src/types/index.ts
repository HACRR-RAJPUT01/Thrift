export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  category: 'Jackets' | 'Shirts' | 'Jeans' | 'Hoodies' | 'Accessories';
  sizes: string[];
  conditionBadge: string;
  conditionGrade: 'Grade A (Excellent Vintage)' | 'Grade B (Good Vintage)' | 'Pristine Restock';
  description: string;
  image: string;
  galleryImages: string[];
  measurements: {
    chest?: string;
    length?: string;
    shoulder?: string;
    waist?: string;
    inseam?: string;
    sleeve?: string;
  };
  visibleFlaws: string;
  careNotes: string;
  fabricDetails: string;
  sampleReviewCount?: number;
  sampleRating?: number;
  has3DModel?: boolean;
}

export interface CartItem {
  id: string; // unique item key: productId-size
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  responsibility: string;
  image: string;
  gender: 'female' | 'male';
  department: 'Leadership' | 'Operations' | 'Marketing' | 'Finance' | 'Experience';
  college: string;
  gradYear?: string;
  favoriteThrift: string;
  bioQuote: string;
  skills: string[];
  keyAchievement?: string;
}

export interface FinancialBreakdown {
  startingCapital: number;
  items: {
    label: string;
    amount: number;
    percent: number;
    description: string;
  }[];
  salesTarget: {
    units: number;
    averageSellingPrice: number;
    targetRevenue: number;
  };
  projection: {
    revenue: number;
    stockCost: number;
    operatingCost: number;
    projectedOperatingProfit: number;
    disclaimer: string;
  };
}
