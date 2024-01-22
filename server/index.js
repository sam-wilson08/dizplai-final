const fs = require('fs')
const express = require('express')
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const polls = JSON.parse(fs.readFileSync(`${__dirname}/data/polls.json`))

app.get('/api/polls', (req, res) => {
    res.status(200).json({
        status: 'success',
        polls
    })
})

app.get('/api/poll/:id', (req, res) => {
    const id = req.params.id;
    const poll = polls.filter(function(p){return p.pollId == id;})
  
    if (!poll) {
      return res.status(404).json({
        status: 'fail',
        message: 'Poll not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        poll,
      },
    });
  });
  
  app.post('/api/poll/:id', (req, res) => {
    const id = req.params.id;
    const poll = polls.find((p) => p.pollId == id);
  
    if (!poll) {
      return res.status(404).json({
        status: 'fail',
        message: 'Poll not found',
      });
    }
  
    const optionId = req.body.vote; 
    const option = poll.options.find((o) => o.optionId == optionId);
  
    if (!option) {
      return res.status(404).json({
        status: 'fail',
        message: 'Option not found',
      });
    }
  
    option.votes += 1;
  
    res.status(200).json({
      status: 'success',
      data: {
        poll,
      },
    });
  });

app.get('/api/health', (req, res) => {
res.status(200).json({
    status: 'success',
    message: 'Server is running and accessible.',
});
});

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
})

  process.on('SIGINT', () => {
    fs.writeFileSync(`${__dirname}/data/polls.json`, JSON.stringify(polls));
    process.exit();
  });
  