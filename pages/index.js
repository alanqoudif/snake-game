import Head from 'next/head';
import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [wins, setWins] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [theme, setTheme] = useState('light');
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        });
        setScore(prevScore => prevScore + 1);
        setEncouragementMessage(getRandomEncouragement());

        if ((score + 1) % 5 === 0) {
          setLevel(prevLevel => prevLevel + 1);
          setSpeed(prevSpeed => prevSpeed - 20);
        }
      } else {
        newSnake.pop();
      }

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
      } else {
        return newSnake;
      }
      return prevSnake;
    });
  }, [direction, food, score]);

  const changeDirection = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  const handleMobileDirection = useCallback((dir) => {
    switch (dir) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      document.addEventListener('keydown', changeDirection);
      const interval = setInterval(moveSnake, speed);
      return () => {
        document.removeEventListener('keydown', changeDirection);
        clearInterval(interval);
      };
    }
  }, [isGameStarted, speed, moveSnake, changeDirection]);

  useEffect(() => {
    if (isGameStarted && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, 400, 400);

        const gradient = context.createLinearGradient(0, 0, 400, 400);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(1, 'purple');
        context.fillStyle = gradient;

        snake.forEach(segment => {
          context.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        });

        context.fillStyle = 'red';
        context.fillRect(food.x * 20, food.y * 20, 20, 20);
      }
    }
  }, [snake, food, isGameStarted]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setSpeed(200);
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
    setEncouragementMessage('');
    setIsGameStarted(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getRandomEncouragement = () => {
    const messages = [
      'يا بطل! 🎉',
      'استمر، الطريق قدامك طويل 💪',
      'انت رهيب! 😎',
      'أحسنت، إلى الأمام 🌟',
      'عمل رائع! 👏',
      'ممتاز! انت في الطريق الصحيح 👍',
      'السرعة فيك، استمر! 🚀',
      'يا معلم، استمر بالتقدم 👌',
      'شغل ممتاز، واصل يا بطل! 🎯',
      'مهاراتك خارقة! 💥',
      'الطريق قدامك مفتوح، انطلق! 🚀',
      'يا وحش، واصل هجومك 🐉',
      'برافو عليك، واصل الصعود 🔝',
      'انت على المسار الصحيح، لا تتوقف 🛤️',
      'ما هذا الأداء! 👏',
      'استمر، النجاح قريب منك 💼',
      'انت قنبلة نشاط 💥',
      'أداءك في القمة، لا تستسلم 🔥',
      'انت الملك 👑',
      'استمر، كل لقمة تقربك للهدف 🍽️',
      'انت نجم اليوم ⭐',
      'واصل، انت في القمة 🌄',
      'ما هذا الإبداع! ✨',
      'انت عبقري اللعبة 🧠',
      'حطم الأرقام، يا بطل 🏅',
      'أداءك مبهر! 🌟',
      'انت صاروخ 🔥',
      'واصل، انت الأفضل 👏',
      'ما هذا الجنون! 😲',
      'انت محترف اللعبة 🎮'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  useEffect(() => {
    if (isGameOver) {
      setWins(wins + 1);
    }
  }, [isGameOver]);

  return (
    <div className={`flex flex-col justify-center items-center h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} relative`}>
      <Head>
        <title>Snake Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Theme
      </button>
      {!isGameStarted ? (
        <button
          onClick={() => setIsGameStarted(true)}
          className="bg-green-500 text-white px-6 py-3 rounded text-2xl"
        >
          انطلق كالثعبان
        </button>
      ) : (
        <>
          <div className="flex flex-col items-center mt-4">
            <canvas
              ref={canvasRef}
              width="400"
              height="400"
              className={`border ${theme === 'light' ? 'border-gray-800 bg-white' : 'border-gray-500 bg-gray-800'}`}
            ></canvas>
            {encouragementMessage && (
              <div className={`p-4 rounded shadow mt-4 ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                <p className="text-xl">{encouragementMessage}</p>
              </div>
            )}
            {isMobile && (
              <div className="flex flex-col items-center mt-4">
                <button onClick={() => handleMobileDirection('UP')} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
                  ⬆️
                </button>
                <div className="flex space-x-2">
                  <button onClick={() => handleMobileDirection('LEFT')} className="bg-blue-500 text-white px-4 py-2 rounded">
                    ⬅️
                  </button>
                  <button onClick={() => handleMobileDirection('RIGHT')} className="bg-blue-500 text-white px-4 py-2 rounded">
                    ➡️
                  </button>
                </div>
                <button onClick={() => handleMobileDirection('DOWN')} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                  ⬇️
                </button>
              </div>
            )}
          </div>
          <div className={`absolute top-10 right-10 p-4 rounded shadow ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
            <h2 className="text-2xl mb-2">Score: {score}</h2>
            <h2 className="text-2xl mb-2">Level: {level}</h2>
            <h2 className="text-2xl mb-2">Wins: {wins}</h2>
            {isGameOver && (
              <div className="text-center">
                <p className="text-xl mb-4">Game Over!</p>
                <button
                  onClick={handleRestart}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
