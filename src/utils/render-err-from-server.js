export function renderErrFromServer(res, toastOptions, setError){
    const errs = res?.errors || {};
    toastOptions.error = res?.message || toastOptions.error;
    if (Object.keys(errs).length) {
        for (let field in errs) {
            setError(field, {
                type: 'server',
                message: errs[field],
            });
        }
    }
    return errs
}