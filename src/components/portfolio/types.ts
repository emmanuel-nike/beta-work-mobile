import type { PortfolioForm } from '../../data/artisanPortfolio';

export type PortfolioStepProps = Readonly<{
  form: PortfolioForm;
  update: (patch: Partial<PortfolioForm>) => void;
}>;
