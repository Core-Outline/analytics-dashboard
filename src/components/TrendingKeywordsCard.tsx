import React from 'react';
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { useParams } from 'react-router-dom';

const PALETTE = [
  '#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4', '#caf0f8',
];

const TrendingKeywordsCard: React.FC = () => {
  const [keywords, setKeywords] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { organization_id } = useParams();

  React.useEffect(() => {
    setLoading(true);
    const fetchTrendingKeywords=async()=>{
      let dataSourceIds = await fetch(`http://localhost:4000/data-source?type=social_media,twitter,instagram,tiktok&organization_id=${organization_id}`)
      const dataSourceIdsData = await dataSourceIds.json();
      dataSourceIds = dataSourceIdsData.map((ds: any) => ds.DATA_SOURCE_ID);


      fetch(`http://localhost:5000/get-keywords?search_type=all&data_source_ids=${dataSourceIds.join(",")}&company_id=${organization_id}&indices=tiktok,twitter`)
        .then(res => res.json())
        .then(data => {
          setKeywords(data);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e)
          setLoading(false)
        });

      }

      fetchTrendingKeywords()
  }, []);

  // Calculate min and max safely
  const values = keywords.map(k => k.value);
  const min = values.length ? Math.min(...values) : 1;
  const max = values.length ? Math.max(...values) : 1;



  const data = [
    { text: 'Hey', value: 1000 },
    { text: 'lol', value: 200 },
    { text: 'first impression', value: 800 },
    { text: 'very cool', value: 1000000 },
    { text: 'duck', value: 10 },
  ];

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trending Keywords</h3>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </div>
      {/* Word Cloud */}
      {/* <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg min-h-[320px]"> */}
        {loading ? (
          <div className="w-full flex flex-wrap justify-center gap-4">
            {Array(20).fill(0).map((_, i) => (
              <span key={i} className="bg-gray-200 rounded animate-pulse block" style={{ width: 60 + Math.random() * 60, height: 30 + Math.random() * 20, margin: `${Math.random() * 8}px ${Math.random() * 12}px` }} />
            ))}
          </div>
        ) : keywords.length === 0 ? (
          <div className="text-gray-400 text-center w-full">No data available</div>
        ) : (
          
          <WordCloud
            data={keywords
              .filter(k => k.name && typeof k.value === 'number')
              .map(k => ({ text: k.name, value: k.value }))}
            font="Nunito, sans-serif"
            fontWeight={(word: any) => word.value > 0.85 * max ? 'bold' : word.value > 0.5 * max ? '600' : '400'}
            fontSize={(word: any) => {
              if (max === min) return 24;
              return 18 + 36 * ((word.value - min) / (max - min));
            }}
            spiral="archimedean"
            rotate={() => (Math.random() > 0.7 ? (Math.random() > 0.5 ? 90 : -90) : 0)}
            padding={2}
            width={600}
            height={320}
            fill={(_word: any, i: number) => PALETTE[i % PALETTE.length]}
            random={Math.random}
          />

        )}
      {/* </div> */}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
          <span>High frequency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-700 rounded-full"></div>
          <span>Medium frequency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Low frequency</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingKeywordsCard;