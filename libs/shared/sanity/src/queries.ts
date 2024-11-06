import { defineQuery } from 'next-sanity';

export const RESOURCE_QUERY = defineQuery(`*[_type == "resource" && 
  slug.current == $slug][0]{
    _id,
    title,
    publishedAt,
    slug,
    category->{
      title,
    },
    author->{
      _id,
      name,
      image {
        asset
      }
    },
    mainImage{
     alt,
     name,
     asset
    },
    socialNetwork[] ->{
      _id,
      url,
      image
    },
    "slug": slug.current,
    preview,
    content[]{
      _type,
      _key,
      _type == "oneColumn" => {
        content[]{
          _key,
          _type,
          _type == "banner" => {
            title,
            bannerImage{
              asset,
              alt
            },
            link,
            description
          },
          _type == "richText" => {
            richTextContent[]{
              ...,
            }
          },
          _type == "sanityImage" => {
            alt,
            asset,
            "metadata": asset->metadata {
              dimensions,
            }
          }
        }
      },
      _type == "twoColumn" => {
        _id,
        content[]{
          _key,
          _type,
          _type == "quote" => {
            author,
            quoteText
          },
          _type == "sanityImage" => {
            alt,
            asset,
            "metadata": asset->metadata {
              dimensions,
            }
          }
        }
      }
    },
    timeToRead
}
`);

export const RESOURCE_META_QUERY = defineQuery(`
  *[_type == "resource" && slug.current == $slug][0]{
    metaData {
      title,
      description
    }
  }
`);

export const RESOURCES_PAGE_QUERY = defineQuery(`
*[_type == "resources"][0]{
  _id,
  title,
  subtitle,
  categories[]->{
    _id,
    title
  },
  mainImage{
    alt,
    name,
    asset
  },
  featured->{
    _id,
    author->{
      name,
    },
    title,
    "slug": slug.current,
    preview,
    publishedAt,
    tag[]->{
      _id,
      name
    },
    mainImage{
      alt,
      name,
      asset
    },
    timeToRead,
    content
  }
}
`);
export const RESOURCES_QUERY = defineQuery(`*[_type == "resource" && 
  (!defined($category) || category->title == $category)] | order(publishedAt desc){
    _id,
    title,
    publishedAt,
    slug,
    category->{
      title,
    },
    author->{
      _id,
      name,
      image
    },
    "slug": slug.current,
    preview,
    mainImage{
      alt,
      name,
      asset
    },
    tag[]->{
      _id,
      name
    },
    timeToRead
}`);

export const OUR_TEAM_QUERY = defineQuery(
  `*[_type == "about"][0]{
    member[] -> {
      _id,
      title,
      name,
      image
    }
  }`
)