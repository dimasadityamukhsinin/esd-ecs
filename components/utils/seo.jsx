import React from 'react';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const SEO = ({
  inputSEO = '',
  defaultSEO = '',
  webTitle = '',
  title = 'ESD in ECS',
  pagelink = 'https://esd-in-ecs.com',
}) => {
  const description = defaultSEO.SEO_Description; // Insert Blank
  const image = defaultSEO.SEO_Image.data.attributes.url; // Insert Blank

  const image_alt = defaultSEO.Website_Title;

  const meta_keywords = defaultSEO.SEO_Keywords;

  const pagetitle = title && webTitle ? `${title} • ${webTitle}` : `ESD in ECS®`;
  const canonicalLink = `https://esd-in-ecs.com${
    pagelink ? `${pagelink.startsWith('/') ? '' : '/'}${pagelink}` : ''
  }`;

  return (
    <>
      <NextSeo
        title={pagetitle}
        description={description}
        canonical={canonicalLink}
        openGraph={{
          url: canonicalLink,
          title: pagetitle,
          description: description,
          type: 'website',
          images: [
            {
              url: image,
              alt: image_alt,
              width: 800,
              height: 600,
              type: 'image/jpeg',
            },
          ],
          site_name: 'Locavore',
        }}
        twitter={{
          site: 'Locavore',
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        <meta name='keywords' content={meta_keywords} />
      </Head>
    </>
  );
};

export default SEO;
