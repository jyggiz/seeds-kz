import fetchMock from 'fetch-mock';
import navData from 'app/component/block/s01-navigation/data/navigation-seeds.yaml';
import navConfig from './data/default.yaml';

// Define a mocked response for the API endpoint
fetchMock
  .mock(navConfig.dataEndpoint || '/navData', {
    status: 200,
    body: navData,
  })
  .flush()
  .then(() => {
    fetchMock.reset();
  });
