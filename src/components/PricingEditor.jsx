import { useState, useEffect } from 'react';
import { getPricing, savePricing } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';

export default function PricingEditor() {
  const [pricing, setPricing] = useState(getPricing());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPricing(getPricing());
  }, []);

  const onChange = (k, v) => {
    setPricing(p => ({ ...p, [k]: v }));
    setDirty(true);
  };

  const onSave = () => {
    const saved = savePricing(pricing);
    setPricing(saved);
    setDirty(false);
    alert('Configurações de preço salvas.');
    // reload page or broadcast change if needed
  };

  return (
    <div className="pricing-editor">
      <div className="pricing-row">
        <label>Preço Base (R$)</label>
        <input type="number" value={pricing.basePrice} onChange={e => onChange('basePrice', Number(e.target.value))} />
        <span>{formatCurrency(pricing.basePrice)}</span>
      </div>
      <div className="pricing-row">
        <label>Convidados Incluídos</label>
        <input type="number" value={pricing.includedGuests} onChange={e => onChange('includedGuests', Number(e.target.value))} />
      </div>
      <div className="pricing-row">
        <label>Valor por convidado extra (R$)</label>
        <input type="number" value={pricing.extraPerGuest} onChange={e => onChange('extraPerGuest', Number(e.target.value))} />
        <span>{formatCurrency(pricing.extraPerGuest)}</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="btn btn--primary" onClick={onSave} disabled={!dirty}>Salvar</button>
      </div>
    </div>
  );
}
