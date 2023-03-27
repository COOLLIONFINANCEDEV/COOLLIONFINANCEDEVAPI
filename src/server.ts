import debug from 'debug';
import app from './app';

const logger = debug("coollion:server");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger(`Server running on port ${PORT}`);
});
