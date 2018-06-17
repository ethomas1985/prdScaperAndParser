declare function htmlResponseHandler(response: any): void | any;

declare module "website-scraper-phantom" {

	export = htmlResponseHandler;
}