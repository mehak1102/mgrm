export default function FloatingLabelField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  as = "input",
  rows = 4,
  className = "",
}) {
  const hasValue = Boolean(value && String(value).trim().length > 0);

  const shared =
    "support-field-input peer w-full rounded-[22px] border border-edge theme-panel backdrop-blur-xl px-5 pb-3 text-fg focus:outline-none focus:ring-2 focus:ring-cyan-500/35 dark:focus:ring-cyan-400/30 transition-all duration-250 placeholder:text-transparent placeholder:opacity-0";

  const isTextarea = as === "textarea";
  const inputPad = isTextarea ? "pt-8 min-h-[132px]" : "pt-6 h-[58px]";
  const labelEmptyPos = isTextarea
    ? "top-6 translate-y-0 peer-focus:top-2"
    : "top-1/2 -translate-y-1/2 peer-focus:top-2 peer-focus:translate-y-0";

  return (
    <div className={`relative support-field ${className}`}>
      {isTextarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          className={`${shared} ${inputPad} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          className={`${shared} ${inputPad}`}
        />
      )}
      <label
        htmlFor={id}
        className={`absolute left-5 pointer-events-none transition-all duration-250 origin-left ${
          hasValue
            ? "top-2 text-xs text-brand scale-95"
            : `${labelEmptyPos} text-sm text-fg-muted peer-focus:text-xs peer-focus:text-brand peer-focus:scale-95`
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    </div>
  );
}
