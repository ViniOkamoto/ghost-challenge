export function Identifier({ idTransacao }: { idTransacao: string }) {
  return (
    <div className="text-center mb-4">
      <p className="text-gray-600 text-sm">Identificador:</p>
      <p className="text-gray-600 text-sm font-bold">{idTransacao}</p>
    </div>
  );
}
