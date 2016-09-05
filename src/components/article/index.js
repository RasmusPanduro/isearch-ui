import React, { PropTypes } from 'react';
import ArticleFooter from '../../../lib/article-tile/article-footer.js';
import NavHeader from '../../../lib/nav-header/';
import Tag from '../../../lib/tags/tag.js';
import FadeImage from '../../../lib/fade-image';
import StaticBaseClass from '../staticBaseClass';
import './style.css';

/*
 * This component uses dangerouslySetInnerHTML to render the article text
 * This is because text from the article editor (http://numo-labs-articles.s3-website-eu-west-1.amazonaws.com/)
 * is saved as a html string - React escapes html to prevent XSS attacks unless
 * it is set using dangerouslySetInnerHTML
 */

class ArticleFullPage extends StaticBaseClass {
  constructor () {
    super();
    this.getArticleData = this.getArticleData.bind(this);
    this.state = {
      articleContent: {}
    };
  }

  render () {
    const { articleContent, goBack, go } = this.props;
    const tagColours = {
      amenities: 'rgba(12,125,125,0.6)',
      geo: 'rgba(12,125,12,0.6)'
    };

    /**
     * Render tags if exist.
     * @param  {[object]} tags    array of tag objects with 'value' and 'label'
     * @param  {string} tagsType  name of the tags type (amenities or geo for now)
     * @return {reactcomponent}   rendered tags
     */
    function renderTags (tags, tagsType) {
      if (tags && tags.length > 0) {
        tags.map((tag, key) => {
          return (
            <Tag key={tagsType + key} displayName={tag.label} colour={tagColours[tagsType]} removeTag={() => {}}/>
          );
        });
      }
    }

    if (!articleContent.name) {
      return (<section/>);
    } else {
      const introSection = articleContent.sections[0];
      const content = articleContent.sections.slice(1);
      this.addAnalyticsData();
      if (document.querySelector('title')) document.querySelector('title').innerHTML = 'article | ' + introSection.title;
      return (
        <section>
          <NavHeader backToSearch={goBack} go={go}/>
          <div className='articleFullPageContainer'>
            <div className='articleHeaderImage' style={{backgroundImage: `url(${introSection.image})`}} />
            <div className='articleContentContainer'>
              <section>
                <div className='articleSection'>
                  <div className='articleHeaderIntro'>{introSection.title}</div>
                  {introSection.text ? <div className='articleIntroText' dangerouslySetInnerHTML={this.rawMarkup(introSection.text)}/> : null}
                </div>
              </section>
            { content.map((section, key) => {
              return (
                <section key={key}>
                  {key === 0 && section.image ? <FadeImage className='articleHeader articleImage' src={section.image}/> : null}
                  <div key={key} className='articleSection'>
                    {key !== 0 && section.image ? <FadeImage className='articleImage' src={section.image}/> : null}
                    {section.title ? <h2>{section.title}</h2> : null}
                    {section.text ? <div className='articleText' dangerouslySetInnerHTML={this.rawMarkup(section.text)}/> : null}
                  </div>
                </section>
              );
            })}
              {
                (articleContent.geo || articleContent.amenities) &&
                <div className='tagSection'>
                  {renderTags(articleContent.geo, 'geo')}
                  {renderTags(articleContent.amenities, 'amenities')}
                </div>
              }
            <ArticleFooter articleName={articleContent.name} onAddTagClick={this.onAddTagClick.bind(this)} />
            </div>
          </div>
        </section>
      );
    }
  }
}

ArticleFullPage.propTypes = {
  articleContent: PropTypes.object,
  goBack: PropTypes.func,
  go: PropTypes.func,
  getArticle: PropTypes.func,
  params: PropTypes.object,
  addSingleTag: PropTypes.func,
  addArticleTag: PropTypes.func
};

export default ArticleFullPage;
