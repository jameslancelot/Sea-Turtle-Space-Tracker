import React, { useState } from 'react';
import { Clock, Target, Eye, Lightbulb, Award, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * VideoLearningContext Component
 *
 * Provides educational context and engagement tools for launch videos:
 * - What to watch for (key moments)
 * - Learning goals
 * - Fun challenges
 * - Post-video engagement
 *
 * Designed to transform passive watching into active learning for 9-year-olds
 */
const VideoLearningContext = ({ video, launch, onVideoComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const [watchedKeyMoments, setWatchedKeyMoments] = useState([]);

  if (!video || !launch) return null;

  const learningContext = generateLearningContext(launch, video);
  const keyMoments = generateKeyMoments(launch);

  return (
    <div className="video-learning-context mt-6 space-y-4">
      {/* Pre-Video: What to Watch For */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-lg border-2 border-teal-200">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <h4 className="text-sm font-black text-[#0f766e] flex items-center gap-2">
            <Eye className="w-4 h-4" />
            What to Watch For
          </h4>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-teal-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-teal-600" />
          )}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-700 leading-relaxed">
              {learningContext.whatToWatchFor}
            </p>
          </div>
        )}
      </div>

      {/* Key Moments Timeline */}
      {keyMoments.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border-2 border-[#FDB913]">
          <h4 className="text-sm font-black text-[#F7941D] mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Key Moments to Spot
          </h4>
          <div className="space-y-2">
            {keyMoments.map((moment, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs text-gray-700"
              >
                <span className="text-[#F7941D] font-black min-w-[20px]">{moment.emoji}</span>
                <span className="flex-1">{moment.description}</span>
                {moment.timestamp && (
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-mono text-gray-600">
                    {moment.timestamp}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sea Turtle Learning Tip */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-[#FDB913]">
        <h4 className="text-sm font-black text-[#F7941D] mb-2 flex items-center gap-2">
          <span className="text-base">🐢</span>
          Sea Turtle Says:
        </h4>
        <p className="text-xs text-gray-700 leading-relaxed">
          {learningContext.seaTurtleTip}
        </p>
      </div>

      {/* Fun Challenge */}
      {learningContext.funChallenge && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-300">
          <h4 className="text-sm font-black text-purple-700 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Fun Challenge!
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            {learningContext.funChallenge}
          </p>
        </div>
      )}

      {/* Learning Goal */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
        <h4 className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
          <Award className="w-3 h-3" />
          What You'll Learn:
        </h4>
        <p className="text-xs text-gray-600">
          {learningContext.learningGoal}
        </p>
      </div>
    </div>
  );
};

/**
 * Generate educational learning context based on launch data
 */
function generateLearningContext(launch, video) {
  const orbit = launch.mission?.orbit?.name?.toLowerCase() || '';
  const missionType = launch.mission?.type?.toLowerCase() || '';
  const name = launch.name?.toLowerCase() || '';
  const location = launch.pad?.location?.name?.toLowerCase() || '';

  let whatToWatchFor = "Watch the rocket engines ignite and the powerful liftoff!";
  let seaTurtleTip = "Just like sea turtles push through waves, rockets push through clouds!";
  let funChallenge = "Count how many seconds from engine start to liftoff!";
  let learningGoal = "Understand how rockets escape Earth's gravity";

  // Customize based on mission type
  if (missionType.includes('communication') || name.includes('starlink')) {
    whatToWatchFor = "Watch how this rocket carries satellites that help us connect across the world!";
    seaTurtleTip = "These satellites help scientists track sea turtles in the ocean using GPS!";
    funChallenge = "Imagine how many sea turtle tracking devices this satellite could power!";
    learningGoal = "Learn how satellites help us communicate and track wildlife";
  } else if (orbit.includes('iss') || orbit.includes('station') || name.includes('crew')) {
    whatToWatchFor = "Watch for the moment when astronauts start their journey to the Space Station!";
    seaTurtleTip = "Astronauts train underwater, just like how we study sea turtles underwater!";
    funChallenge = "Look for the astronaut waving inside the spacecraft window!";
    learningGoal = "See how humans travel to space to live and work";
  } else if (orbit.includes('lunar') || orbit.includes('moon') || name.includes('moon')) {
    whatToWatchFor = "This rocket is going to the MOON - 238,000 miles away!";
    seaTurtleTip = "A sea turtle would need to swim for millions of years to reach the Moon!";
    funChallenge = "Watch for the moment the rocket leaves Earth's atmosphere!";
    learningGoal = "Discover what it takes to reach the Moon";
  } else if (missionType.includes('science') || missionType.includes('research')) {
    whatToWatchFor = "This mission carries special science tools to study space!";
    seaTurtleTip = "Just like scientists study sea turtles, space scientists study the universe!";
    funChallenge = "Think about what questions scientists might answer with this mission!";
    learningGoal = "Explore how scientists use space missions to learn";
  } else if (orbit.includes('geo') || orbit.includes('geostationary')) {
    whatToWatchFor = "Watch this rocket climb all the way to geostationary orbit!";
    seaTurtleTip = "This orbit is so high, the satellite stays over the same spot on Earth!";
    funChallenge = "Compare this to how sea turtles navigate using Earth's magnetic field!";
    learningGoal = "Learn about different types of orbits around Earth";
  }

  // Add location-specific tips
  if (location.includes('florida') || location.includes('kennedy') || location.includes('cape canaveral')) {
    seaTurtleTip = "This launch is from Florida - the same state as our school! Sea turtles nest on these beaches! 🏖️";
  } else if (location.includes('vandenberg')) {
    seaTurtleTip = "This launch is from California, over the Pacific Ocean where sea turtles swim! 🌊";
  } else if (location.includes('baikonur')) {
    seaTurtleTip = "This is the oldest space launch site in the world - in Kazakhstan's desert! 🏜️";
  }

  return {
    whatToWatchFor,
    seaTurtleTip,
    funChallenge,
    learningGoal
  };
}

/**
 * Generate key moments to watch for during video
 */
function generateKeyMoments(launch) {
  const moments = [];
  const name = launch.name?.toLowerCase() || '';
  const rocketName = launch.rocket?.configuration?.name?.toLowerCase() || '';

  // Universal moments for all launches
  moments.push({
    emoji: '🔥',
    description: 'Engine ignition - watch for the bright flames!',
    timestamp: '~T-3s'
  });

  moments.push({
    emoji: '🚀',
    description: 'Liftoff - the rocket starts moving upward!',
    timestamp: 'T+0s'
  });

  // Rocket-specific moments
  if (rocketName.includes('falcon') || rocketName.includes('starship')) {
    moments.push({
      emoji: '🎯',
      description: 'Booster landing - watch for the amazing landing!',
      timestamp: '~T+8min'
    });
  }

  if (name.includes('crew') || name.includes('dragon') || launch.mission?.type?.toLowerCase().includes('human')) {
    moments.push({
      emoji: '👨‍🚀',
      description: 'Astronaut wave - look for crew waving goodbye!',
      timestamp: 'Pre-launch'
    });
  }

  moments.push({
    emoji: '☁️',
    description: 'Breaking through clouds - rocket punches through!',
    timestamp: '~T+30s'
  });

  moments.push({
    emoji: '🌍',
    description: 'View of Earth - see our planet from space!',
    timestamp: '~T+2min'
  });

  return moments.slice(0, 4); // Max 4 key moments for kids
}

/**
 * Post-Video Quiz Component (Future Enhancement)
 */
export const PostVideoQuiz = ({ launch, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What color were the rocket flames?",
      options: ["Blue", "Orange/Red", "Green", "Purple"],
      correct: 1,
      type: "visual"
    },
    {
      id: 2,
      question: `Where did this launch happen?`,
      options: [
        launch.pad?.location?.name || "Unknown",
        "Antarctica",
        "The Moon",
        "Under the ocean"
      ],
      correct: 0,
      type: "comprehension"
    }
  ];

  const handleSubmit = () => {
    setShowResults(true);
    const correct = Object.values(answers).filter((a, i) => a === questions[i].correct).length;
    if (onComplete) {
      onComplete({ correct, total: questions.length });
    }
  };

  // Implementation continues...
  // (Future enhancement - full quiz system)

  return null; // Placeholder for now
};

export default VideoLearningContext;
