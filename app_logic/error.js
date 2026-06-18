
export class RedirectNeeded extends Error {
    constructor(redirectToUrl) {
        super(`Error and need to redirect to this page: ${redirectToUrl}`)

        this.name = 'RedirectNeeded'

        this.redirectUrl = redirectToUrl
    }
}

export function showError(errText) {
    const toast = document.getElementById('error-toast')
    toast.textContent = errText
    
    if (!toast) {
        return
    }
  
    toast.classList.add('show')
  
    setTimeout(() => {
      toast.classList.remove('show')
    }, 3000)
  }