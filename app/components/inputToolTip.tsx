type Props = {
  label?: string
  errorMessage?: string
  children:React.ReactNode
}

const InputWithTooltip = ({
  label,
  errorMessage,
  children
}: Props) => {
  return (
    <div className="relative w-full">
      {label && <label className="text-sm text-gray-600 mb-2 block">{label}</label>}
      {children}
      {errorMessage && (
        <div className="absolute border border-gray-200 bg-white p-2 left-1/2 -translate-x-1/2 -top-11 rounded-md text-xs text-red-700 shadow-xl whitespace-nowrap z-10">
          {errorMessage}
          <div className="absolute left-1/2 -translate-x-1/2 rotate-45 -bottom-1 w-2 bg-white border-white aspect-square" />
        </div>
      )}
    </div>
  )
}

export default InputWithTooltip