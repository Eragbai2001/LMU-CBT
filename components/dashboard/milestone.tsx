import { Trophy } from "lucide-react";
import Image from "next/image";

interface MilestoneUser {
  name: string;
  score: number;
  avatar: string;
}

export default function Milestones() {
  const users: MilestoneUser[] = [
    {
      name: "Emma",
      score: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Alex",
      score: 4,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Sarah",
      score: 2,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-800">Milestones</h3>
        </div>

        <div className="bg-amber-100 rounded-full p-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <MilestoneItem key={index} user={user} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

interface MilestoneItemProps {
  user: MilestoneUser;
  rank: number;
}

function MilestoneItem({ user, rank }: MilestoneItemProps) {
  const totalXP = 8;
  // Generate a gradient based on rank
  const getGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-amber-500 to-amber-300";
      case 2:
        return "from-slate-400 to-slate-300";
      case 3:
        return "from-amber-700 to-amber-500";
      default:
        return "from-gray-400 to-gray-300";
    }
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <Image
              src={"/profil.jpeg"}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>

          {/* Rank indicator - only visible on hover */}
          <div
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${getGradient(
              rank
            )} 
                          flex items-center justify-center text-white text-xs font-bold
                          opacity-0 group-hover:opacity-100 transition-opacity shadow-sm`}
          >
            {rank}
          </div>
        </div>

        <span className="font-medium text-gray-800">{user.name}</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-lg font-bold">{user.score}</div>

        {/* Progress bar - animated on hover */}
        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 group-hover:animate-pulse"
            style={{ width: `${(user.score / totalXP) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
