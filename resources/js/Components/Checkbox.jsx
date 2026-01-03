export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.2)] focus:ring-0 focus:ring-offset-0 checked:bg-slate-900 checked:border-slate-900 ' +
                className
            }
        />
    );
}
