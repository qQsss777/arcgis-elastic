import { testsRoutesFeatureServer } from './tests-routes-featureserver';
import { testsRoutesGeojson } from './tests-routes-geojson';

export const runRoutesTests = () => {
    testsRoutesFeatureServer();
    testsRoutesGeojson();
}