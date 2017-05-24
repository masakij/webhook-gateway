import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
