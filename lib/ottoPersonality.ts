// Otto the Octopus - AI Tutor Personality System

export const getOttoGreeting = (name: string, timeOfDay: 'morning' | 'afternoon' | 'evening') => {
  const greetings = {
    morning: [
      `Good morning, ${name}! 🌅 Otto here, ready to count on my 8 tentacles!`,
      `Rise and shine, ${name}! ☀️ Let's make some math magic happen today!`,
      `Morning, superstar! 🌟 Otto's got fresh problems brewing in my octopus brain!`,
    ],
    afternoon: [
      `Hey ${name}! 👋 Otto's been swimming around, finding the best problems for you!`,
      `Afternoon, math champion! 🎯 Ready to flex those brain muscles?`,
      `Hi ${name}! 🐙 Otto's 8 arms are ready to help you tackle some problems!`,
    ],
    evening: [
      `Evening, ${name}! 🌙 Otto never sleeps when there's math to be done!`,
      `Hey there, night owl! 🦉 Otto's here to light up your brain with math!`,
      `Good evening, ${name}! ⭐ Let's make tonight mathematically magnificent!`,
    ],
  }
  
  const options = greetings[timeOfDay]
  return options[Math.floor(Math.random() * options.length)]
}

export const getOttoMotivation = (streak: number, score: number) => {
  if (streak >= 10) {
    return [
      "🔥 TEN IN A ROW?! You're absolutely crushing it! My tentacles are doing a happy dance!",
      "🎉 INCREDIBLE! You're on fire! At this rate, you'll be teaching ME math!",
      "⚡ UNSTOPPABLE! Your brain is working faster than I can swim!",
    ][Math.floor(Math.random() * 3)]
  }
  
  if (streak >= 5) {
    return [
      "🌟 Five correct! You're making Otto proud! Keep riding this wave!",
      "💪 That's a solid streak! Your confidence must be through the reef!",
      "🎯 FIVE! You're in the zone! Don't stop now, superstar!",
    ][Math.floor(Math.random() * 3)]
  }
  
  if (streak >= 3) {
    return [
      "📈 Three in a row! You're building momentum like a rolling wave!",
      "✨ Nice streak going! I can see the math gears turning in your head!",
      "🚀 THREE! Houston, we have a math genius on board!",
    ][Math.floor(Math.random() * 3)]
  }
  
  if (score >= 100) {
    return [
      "💯 Over 100 points! You're making Otto's 8 hearts swell with pride!",
      "🏆 Look at that score! You're a certified math superstar!",
      "🌊 Riding high on a wave of success! Keep it up, champion!",
    ][Math.floor(Math.random() * 3)]
  }
  
  if (score >= 50) {
    return [
      "🎈 You're doing great! Otto believes in you 100%!",
      "✨ Your progress is making waves! Keep swimming forward!",
      "💙 Looking good! Every problem you solve makes you stronger!",
    ][Math.floor(Math.random() * 3)]
  }
  
  return [
    "🐙 Remember, every expert was once a beginner! You've got this!",
    "🌊 Take your time! Math is a journey, not a race!",
    "💙 Otto's here to help! We'll tackle these problems together, one tentacle at a time!",
    "⭐ Believe in yourself! You're capable of amazing things!",
  ][Math.floor(Math.random() * 4)]
}

export const getOttoEncouragement = (isCorrect: boolean, streak: number) => {
  if (isCorrect) {
    const messages = [
      "🎉 YES! That's exactly right! You nailed it!",
      "⭐ CORRECT! My tentacles are giving you a standing ovation!",
      "🌟 Brilliant! You've got the mathematical touch!",
      "💯 Perfect! Your brain is sharper than a sea urchin's spines!",
      "🎯 BINGO! You're a natural at this!",
      "🚀 Spot on! To infinity and beyond (with correct answers)!",
      "🏆 Winner! Otto's impressed! That was top-notch thinking!",
      "✨ Spectacular! You're making math look easy!",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  } else {
    const messages = [
      "🤔 Not quite, but hey - mistakes are just learning in disguise!",
      "💙 Close one! Every mistake brings you closer to mastery!",
      "🌊 Whoa there! Let's swim back and try again!",
      "🎯 Almost! Otto knows you'll get the next one!",
      "💪 That's okay! Even my 8 brains get confused sometimes!",
      "🌟 No worries! Rome wasn't built in a day, and neither is math mastery!",
      "🐙 Oops! But that's how we learn! Let's tackle another one!",
      "✨ Not this time, but Otto believes in comebacks!",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
}

export const getOttoHintIntro = () => {
  const intros = [
    "🤫 Psst! Otto's got a hint for you...",
    "💡 Need a nudge? Let me share a secret...",
    "🐙 Here's a little help from one of my 8 brains...",
    "✨ Let Otto shed some light on this...",
    "🎯 Check this out - it might help...",
  ]
  return intros[Math.floor(Math.random() * intros.length)]
}

export const getOttoMessage = (type: 'welcome' | 'newProblem' | 'idle' | 'struggling') => {
  const messages = {
    welcome: [
      "🐙 Hey there! I'm Otto the Octopus, your personal math tutor! With my 8 tentacles and 8 brains, we're going to make math FUN! Ready to dive in?",
      "👋 Welcome! I'm Otto - part octopus, part math wizard, 100% here to help YOU succeed! Let's make some mathematical waves together!",
      "🌊 Ahoy! Otto here! I've been teaching math in the ocean for years (fish are terrible at fractions, by the way). But YOU? You're going to be amazing!",
    ],
    newProblem: [
      "📝 Fresh problem alert! I hand-picked this one just for you!",
      "🎯 Here comes a new challenge! Show me what you've got!",
      "✨ Time for a new adventure in math-land!",
      "🐙 Otto's got a brand new problem brewing! Let's do this!",
    ],
    idle: [
      "👀 Still thinking? Take your time! Otto's not going anywhere!",
      "💭 Your brain is working! I can almost see the gears turning!",
      "🤔 Stuck? Remember, you can always ask for a hint! I've got 8 brains to help!",
      "⏰ No rush! Quality thinking beats speed every time!",
    ],
    struggling: [
      "💙 Hey, it's okay to find this challenging! That means you're learning and growing!",
      "🌟 Remember: You're braver than you believe, stronger than you seem, and smarter than you think!",
      "🐙 Otto believes in you! Want to see the solution? Sometimes seeing the steps helps it click!",
      "💪 You've got this! Every mathematician struggles sometimes - even the great ones!",
    ],
  }
  
  const options = messages[type]
  return options[Math.floor(Math.random() * options.length)]
}

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export const getMotivationalStatement = () => {
  const statements = [
    "You're doing amazing! Every problem you solve makes you stronger! 💪",
    "Believe in yourself! You have the power to learn anything you set your mind to! ✨",
    "Progress, not perfection! Every step forward is a victory! 🌟",
    "You're capable of incredible things! Keep pushing forward! 🚀",
    "Your potential is limitless! Don't let anyone tell you otherwise! 🌈",
    "Mistakes are proof that you're trying! Keep going! 💙",
    "You're braver than you believe and smarter than you think! 🦋",
    "Every expert was once a beginner! You're on the right path! 🛤️",
    "Your hard work will pay off! Keep believing in yourself! 🎯",
    "You're not just learning math, you're building confidence! 🏆",
    "Small steps lead to big achievements! You've got this! 👣",
    "Your effort matters more than your current score! 📈",
    "Challenges help you grow! Embrace them with courage! 🌱",
    "You're making Otto proud just by trying! Keep it up! 🐙",
    "Success is a journey, not a destination! Enjoy the ride! 🎢",
    "Your brain is like a muscle - the more you use it, the stronger it gets! 🧠",
    "Don't compare yourself to others! Focus on being better than yesterday! ⭐",
    "You have everything you need within you to succeed! 💎",
    "Keep going! The breakthrough is closer than you think! 🔓",
    "You're writing your own success story, one problem at a time! 📖"
  ]
  return statements[Math.floor(Math.random() * statements.length)]
}

export const getAppWalkthrough = () => {
  return `Welcome to your math practice app! Here's how it works:

🎯 **Getting Problems**: Click "New Problem" to get a fresh math challenge tailored to your level.

⚙️ **Customize Your Practice**: You can modify the type of problem (addition, subtraction, multiplication, division) and adjust the difficulty level to match your skill!

✍️ **Solving**: Enter your answer in the input field and hit submit to check if you're correct!

📊 **Tracking Progress**: Your score increases with each correct answer. Watch it grow!

📜 **Review Past Problems**: Check the history section to see all your previous problems. Click on any problem to review it in detail!

🐙 **Otto's Help**: That's me! I'm here to motivate you, give hints, and celebrate your wins!

💡 **Tips**: Take your time, read carefully, and don't be afraid to try. Every attempt is a learning opportunity!

Keep practicing and you'll see amazing progress! I believe in you! 🌟`
}

export const getFAQs = () => {
  return `**Frequently Asked Questions:**

❓ **How is my score calculated?**
You earn 10 points for each correct answer!

❓ **Can I skip a problem?**
Just click "New Problem" to get a different challenge!

❓ **What if I get an answer wrong?**
No worries! Learn from it and try the next one. Mistakes help you grow!

❓ **How do I improve faster?**
Practice consistently and take your time to understand each problem!

❓ **Is Otto a real octopus?**
I'm a virtual tutor, but my encouragement is 100% real! 🐙💙`
}
