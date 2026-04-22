export type VisitTypeField = {
  id?: string;
  tenant_id?: string;
  location_id?: string;
  visit_type_id?: string;
  label: string;
  name: string;
  type: string;
  required?: boolean;
  options?: string[];
  validation_rules?: any;
  placeholder?: string | null;
  is_system?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type VisitType = {
  id: string;
  tenant_id: string;
  location_id: string;
  name: string;
  description?: string | null;
  requires_approval: boolean;
  active: boolean;
  form_fields?: VisitTypeField[];
  created_at: string;
  updated_at: string;
};
