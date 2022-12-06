import { Button, Result } from 'antd';

const App: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="something warn"
    extra={<Button type="primary">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/">Back Home</a>
    </Button>}
  />
);

export default App;
