# Astro WordPress Starter

This project is meant to be a flexible starting point for people interested in using [Astro](https://astro.build/) with WordPress as a headless CMS. If you want some additional resources to help get you started, check out the blog post and video linked below.

[✍️ Read the step-by-step tutorial](https://developers.wpengine.com/blog/building-a-headless-wordpress-site-with-astro)
[📹 Watch the video](https://www.youtube.com/watch?v=BcoxZZIfESI)

## Requirements
- [WordPress](https://wordpress.org/)
- [WPGraphQL](https://www.wpgraphql.com/docs/introduction)
- Environment Variables

Add a variable to your `.env.local` and then hit `npm run dev`:

`WORDPRESS_API_URL = https://yoursitename.com/graphql`

### Routing and Templates

This starter project leans into the WordPress CMS routing capabilities and uses a `getNodeByUri` query in WPGraphQL to handle any route path that WordPress knows about. This allows you to handle all WordPress content types using the `[...uri].astro` component. From there, Astro parses the `uri` and uses that to call `getNodeByURI` from `api.js` to fetch data about that resource from the CMS. Once data is returned, we look at the content type and then dynamically resolve a content template from the `templates` directory.

#### Adding Content Types

This project comes with built in support for Post, Page, Tag, and Category types, but could easily be extended for custom post types or other native content types. To add support for a custom post type you would do the following:
1. Add a GraphQL fragment for your post type to `getNodeByURI` from `api.js`
2. Add an Astro component as a template
3. Add a case to the switch statement in `[...uri].astro` to catch the content type and resolve the template

#### Overriding Default Routing

Since routes using [rest parameters in Astro](https://docs.astro.build/en/core-concepts/routing/#rest-parameters) come last in the [route priority order](https://docs.astro.build/en/core-concepts/routing/#route-priority-order), you can easily override this catch-all routing pattern by creating a more specific route to handle a given path. 

For example, if you want the path `/category/food-trucks` to be handled by a different Astro component, you can add a corresponding file to the `pages` directory to override the default `...uri` route.


### Menus 

By default, the menu assigned to the `Primary` menu location will be used for your header menu.

### Rendering and Serving

This project is using the new [hybrid rendering model](https://docs.astro.build/en/guides/server-side-rendering/#hybrid-rendering) available in Astro v2. To pre-render any routes you add, make sure to include the following export in your Astro component's frontmatter:

`export const prerender = true;`

All of the current routes are being pre-rendered to HTML and served using the [standalone node adapter](https://docs.astro.build/en/guides/integrations-guide/node/). This offers users the flexibility to create additional SSR functionality if desired while still optimizing content pages using pre-rendered HTML.

## Headless WordPress Hosting with Atlas

WP Engine's Atlas platform provides a performant and user-friendly hosting platform for headless WordPress and Node-based JavaScript apps. [Create a free sandbox account](https://wpengine.com/atlas/) to try the platform, and check out our Astro deployment guide for instruction to deploy to the platform.

## Possible Errors

Possible error when requesting Node by URI on Custom Post Types with WPML active

### [WPML GraphQL - Fails to Fetch Single Custom Post Type by Slug Based](https://wpml.org/errata/wpml-graphql-fails-to-fetch-single-custom-post-type-by-slug-based/)


When using GraphQL and utilizing a query similar to the following to retrieve Custom Post Types by slug, you will discover that it functions only for the posts in the default language:

```graphql
query getArticlesByslug {
  article(id: "your-slug-goes-here", idType: SLUG) {
    title
    content
  }
}
```

Workaround

**Please, make sure of having a full backup of your site before proceeding.** Open your theme’s functions.php file.
Add this code:

```php
add_filter('request', function($vars){
 
    if ( is_graphql_http_request() && !empty($vars['name']) ) {
        $vars['suppress_filters'] = true;
    }
 
    return $vars;
});
```
