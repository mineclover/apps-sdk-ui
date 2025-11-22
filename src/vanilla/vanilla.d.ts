/**
 * Type declarations for vanilla web components
 */

// Allow importing CSS files as strings with ?inline query
declare module '*.css?inline' {
  const content: string;
  export default content;
}

// Allow importing CSS files
declare module '*.css' {
  const content: string;
  export default content;
}
