type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export default function TryOnButton({ onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold",
        "border border-slate-300 bg-white text-slate-800 shadow-sm transition",
        "hover:bg-slate-50 hover:border-slate-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "w-full sm:w-auto",
      ].join(" ")}
    >
      Thử kính ảo
    </button>
  );
}