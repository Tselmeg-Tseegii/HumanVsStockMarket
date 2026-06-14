
export class RedirectNeeded extends Error {
    constructor(redirectToUrl) {
        super(`Error and need to redirect to this page: ${redirectToUrl}`)

        this.name = 'RedirectNeeded'

        this.redirectUrl = redirectToUrl
    }
}