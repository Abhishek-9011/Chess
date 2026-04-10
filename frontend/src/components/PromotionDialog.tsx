
interface PromotionDialogProps {
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
  isOpen: boolean;
}

const PromotionDialog = ({ onSelect, isOpen }: PromotionDialogProps) => {
  if (!isOpen) return null;

  const pieces = [
    { value: "q" as const, label: "Queen", symbol: "♕" },
    { value: "r" as const, label: "Rook", symbol: "♜" },
    { value: "b" as const, label: "Bishop", symbol: "♝" },
    { value: "n" as const, label: "Knight", symbol: "♞" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-6 shadow-2xl">
        <h3 className="text-white text-lg font-bold mb-4">Promote Pawn To:</h3>
        <div className="grid grid-cols-2 gap-3">
          {pieces.map((piece) => (
            <button
              key={piece.value}
              onClick={() => onSelect(piece.value)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition"
            >
              <div className="text-3xl mb-2">{piece.symbol}</div>
              <div>{piece.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog;
