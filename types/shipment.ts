export type ShipmentStatus = "EM_TRANSITO" | "ENTREGUE" | "PENDENTE" | "ATRASADA";

export interface BlingOrder {
  numero: string;
  cliente: { nome: string };
  rastreamento: {
    codigo: string;
    transportadora: string;
    dataPostagem: string;
    situacao: string;
    ultimaAtualizacao: string;
  };
}

export interface ShipmentFilters {
  status?: string;
  customer?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
}
