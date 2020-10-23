require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const STATIC_DIR = 'build';

app.use(compression());

//app.use(express.static(path.join(__dirname, STATIC_DIR)));

const getPublicUserProfileUrl = username => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const uri = `${BASE_URL}/profile/${username}`;
  return uri;
};

const getUserProfile = username => {
  const uri = getPublicUserProfileUrl(username);
  return axios.get(uri).then(res => res.data);
};

const getSocialGraphTags = username => {
  const publicProfileUrl = `${process.env.REACT_APP_PUBLIC_PROFILE_BASE_URL}/${username}`;
  return getUserProfile(username).then(profile => {
    // console.log(profile);
    if (profile.status_opportunity) {
      let meta = `<meta property="og:url" content="${publicProfileUrl}" />`;
      meta += `<meta name="robots" content="noindex, follow" />
            <meta name="description" content="Check out ${profile.user.first_name}‘s Video Resume" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="Belooga &#8211; The Video Resume Platform" />
            <meta name="twitter:description" content="Check out ${profile.user.first_name}‘s Video Resume" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="Belooga &#8211; The Video Resume Platform" />
            <meta property="og:description" content="Check out ${profile.user.first_name}‘s Video Resume" />`;
      if (profile.cover_image_url && profile.cover_image_url !== '') {
        meta += `<meta property="og:image" content="${profile.cover_image_url}" />`;
        meta += `<meta name = "twitter:image:src" content="${profile.cover_image_url}" />`;
      }
      return meta;
    } else {
      let meta = `<meta property="og:url" content="${publicProfileUrl}" />`;
      meta += `<meta name="robots" content="noindex, follow" />
            <meta name="description" content="Profile not public" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="Belooga &#8211; The Video Resume Platform" />
            <meta name="twitter:description" content="Profile not public" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="Belooga &#8211; The Video Resume Platform" />
            <meta property="og:description" content="Profile not public" />`;
      return meta;
    }
  });
};

const getBlogDetailUrl = blogslug => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const uri = `${BASE_URL}/blog/${blogslug}`;
  return uri;
};

const getBlogDetail = blogslug => {
  const uri = getBlogDetailUrl(blogslug);
  return axios.get(uri).then(res => res.data);
};

const getBlogGraphTags = blogslug => {
  const blogDetailUrl = `${process.env.REACT_APP_BLOG_BASE_URL}/${blogslug}`;
  return getBlogDetail(blogslug).then(blog => {
    let meta = `<meta property="og:url" content="${blogDetailUrl}" />`;
    if (blog.image_url && blog.image_url !== '') {
      meta += `<meta property="og:image" content="${blog.image_url}" />`;
      meta += `<meta name = "twitter:image:src" content="${blog.image_url}" />`;
    }
    let description = 'The First Video Resume Job Board Platform.';
    if (blog.summary) {
      description = blog.summary;
      description = description.slice(0, 100);
    }
    let title = blog.title;
    if (blog.meta_title) {
      title = blog.meta_title;
    }
    if (blog.meta_description) {
      description = blog.meta_description;
    }
    let keywords = 'Belooga, Resume, Video, Resume Video, Job';
    if (blog.meta_keywords) {
      keywords = blog.meta_keywords;
    }
    meta += `<meta name="robots" content="all" />
            <meta name="description" content="${description}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta name="keywords" content="${keywords}" />`;

    return meta;
  });
};

const getBlogFeaturelUrl = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const uri = `${BASE_URL}/blog/feature/`;
  return uri;
};

const getBlogFeature = () => {
  const uri = getBlogFeaturelUrl();
  return axios.get(uri).then(res => res.data);
};

const getDefaultBlogListGraphTags = () => {
  const blogListUrl = `${process.env.REACT_APP_BLOG_BASE_URL}`;
  const blogImage = process.env.REACT_APP_URI + '/images/blog/banner-blog.png';
  let meta = `<meta property="og:url" content="${blogListUrl}" />`;
  meta += `<meta property="og:image" content="${blogImage}" />`;
  meta += `<meta name = "twitter:image:src" content="${blogImage}" />`;
  let description = 'The Belooga blog list page.';
  let title = 'Belooga blog';
  let keywords = 'Belooga, Resume, Video, Resume Video, Job, Blog';
  meta += `<meta name="robots" content="all" />
            <meta name="description" content="${description}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta name="keywords" content="${keywords}" />`;

  return meta;
};

const getMetaHomelUrl = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const uri = `${BASE_URL}/setting/?keys=meta_home`;
  return uri;
};

const getMetaHomePage = () => {
  const uri = getMetaHomelUrl();
  return axios.get(uri).then(res => res.data);
};
const getMetaBlogUrl = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const uri = `${BASE_URL}/setting/?keys=meta_blog`;
  return uri;
};

const getMetaBlogPage = () => {
  const uri = getMetaBlogUrl();
  return axios.get(uri).then(res => res.data);
};

const getHomeGraphTags = () => {
  const homeUrl = `${process.env.REACT_APP_URI}`;
  return getMetaHomePage().then(data => {
    let meta = `<meta property="og:url" content="${homeUrl}" />`;
    meta += `<meta property="og:image" content="${process.env.REACT_APP_URI}/images/logo-big.png" />`;
    meta += `<meta name = "twitter:image:src" content="${process.env.REACT_APP_URI}/images/logo-big.png" />`;

    let description =
      'Brainstorm ideas for your 30-second introduction video, including a highlight reel of your education, work experience, and skills.';
    let title = 'Belooga &#8211; The First Video Resume Job Board Platform';
    let keywords = 'Belooga, Resume, Video, Resume Video, Job';

    if (data.meta_home.meta_title) {
      title = data.meta_home.meta_title;
    }
    if (data.meta_home.meta_description) {
      description = data.meta_home.meta_description;
      description = description.slice(0, 100);
    }
    if (data.meta_home.meta_keywords) {
      keywords = data.meta_home.meta_keywords;
    }
    meta += `<meta name="robots" content="all" />
            <meta name="description" content="${description}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta name="keywords" content="${keywords}" />`;

    return meta;
  });
};
const getBlogShareGraphTags = () => {
  const homeUrl = `${process.env.REACT_APP_URI}`;
  return getMetaBlogPage().then(data => {
    let meta = `<meta property="og:url" content="${homeUrl}/blog" />`;
    meta += `<meta property="og:image" content="${process.env.REACT_APP_URI}/images/logo-big.png" />`;
    meta += `<meta name = "twitter:image:src" content="${process.env.REACT_APP_URI}/images/logo-big.png" />`;

    let description =
      'Learn more about how to land your dream job using the video resume platform.';
    let title = "Belooga's Blog";
    let keywords = 'Belooga, Resume, Video, Resume Video, Job, Blog';

    if (data.meta_blog.meta_title) {
      title = data.meta_blog.meta_title;
    }
    if (data.meta_blog.meta_blog_description) {
      description = data.meta_blog.meta_blog_description;
      description = description.slice(0, 100);
    }
    if (data.meta_blog.meta_blog_keyword) {
      keywords = data.meta_blog.meta_blog_keyword;
    }
    meta += `<meta name="robots" content="all" />
            <meta name="description" content="${description}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="Belooga" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="author" content="Belooga" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta name="keywords" content="${keywords}" />`;

    return meta;
  });
};

app.get('/public/:username', (req, res) => {
  const filePath = path.join(__dirname, 'build/index.html');
  const f = fs.readFileSync(filePath, 'utf8');
  const username = req.params.username;
  getSocialGraphTags(username)
    .then(meta => {
      const data = f.replace('</head>', `${meta}</head>`);
      res.send(data);
    })
    .catch(e => {
      res.send(f);
    });
});

app.get('/user/:username', (req, res) => {
  const filePath = path.join(__dirname, 'build/index.html');
  const f = fs.readFileSync(filePath, 'utf8');
  const username = req.params.username;
  getSocialGraphTags(username)
    .then(meta => {
      const data = f.replace('</head>', `${meta}</head>`);
      res.send(data);
    })
    .catch(e => {
      res.send(f);
    });
});

app.get('/blog', (req, res) => {
  const filePath = path.join(__dirname, 'build/index.html');
  const f = fs.readFileSync(filePath, 'utf8');

  // getBlogFeature().then(data => {
    // const blog = data.results[0];
    // const blogslug = blog.slug;
    // getBlogGraphTags(blogslug)
    //   .then(meta => {
    //     const data = f.replace('</head>', `${meta}</head>`);
    //     res.send(data);
    //   })
    //   .catch(e => {
    //     res.send(f);
    //   });
    getBlogShareGraphTags().then(meta => {
      const data = f.replace('</head>', `${meta}</head>`);
      res.send(data);
    })
    .catch(e => {
      res.send(f);
    });
  // }).catch(e => {
  //   const meta = getDefaultBlogListGraphTags();
  //   const data = f.replace('</head>', `${meta}</head>`);
  //   res.send(data);
  // });
});

app.get('/blog/:blogslug', (req, res) => {
  const filePath = path.join(__dirname, 'build/index.html');
  const f = fs.readFileSync(filePath, 'utf8');
  const blogslug = req.params.blogslug;
  getBlogGraphTags(blogslug)
    .then(meta => {
      const data = f.replace('</head>', `${meta}</head>`);
      res.send(data);
    })
    .catch(e => {
      res.send(f);
    });
});

app.get('/*', (req, res) => {
  const filePath = path.join(__dirname, 'build/index.html');
  const f = fs.readFileSync(filePath, 'utf8');

  getHomeGraphTags()
    .then(meta => {
      const data = f.replace('</head>', `${meta}</head>`);
      res.send(data);
    })
    .catch(e => {
      res.send(f);
    });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', err => {
  if (err) {
    console.log(err);
  }
  console.info(`==>  app listening on http://localhost:${PORT}.`);
});
