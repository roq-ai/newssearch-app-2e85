import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SearchInterface {
  id?: string;
  keyword: string;
  date?: any;
  source_credibility?: number;
  region?: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface SearchGetQueryInterface extends GetQueryInterface {
  id?: string;
  keyword?: string;
  region?: string;
  user_id?: string;
}
