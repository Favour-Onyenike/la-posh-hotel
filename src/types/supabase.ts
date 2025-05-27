
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export type Room = {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_type: string;
  image_url: string | null;
  features: string[];
  availability_status: 'available' | 'taken';
  created_at: string;
  updated_at: string;
}

export type Booking = {
  id: string;
  user_id: string | null;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  total_price: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export type Review = {
  id: string;
  user_id: string | null;
  content: string;
  rating: number;
  reviewer_name: string;
  created_at: string;
  updated_at: string;
}

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export type ContentItem = {
  id: string;
  page: string;
  section: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}
