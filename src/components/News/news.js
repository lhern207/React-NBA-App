import React from 'react';
import NewsList from '../widgets/NewsList/newsList';
import NewsSlider from '../widgets/NewsSlider/slider';

const News = () => {
    return (
        <div>
            <NewsSlider
                type="featured"
                start={0}
                end={3}
                settings={{
                    dots:false
                }}
            />
            <NewsList
                type="imageCard"
                loadmore={true}
                start={3}
                end={13}
                load_amount={10}
            />
        </div>
    );
};

export default News;