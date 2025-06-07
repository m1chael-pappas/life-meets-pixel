import { Award, BarChart3, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CourseCard() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Get started with Python
        </h1>
      </div>

      <Card className="relative overflow-hidden border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Course Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-100 font-medium px-3 py-1"
          >
            Course
          </Badge>
        </div>

        {/* Decorative Illustration */}
        <div className="absolute top-4 right-4 w-20 h-20">
          <div className="relative">
            {/* Greek columns illustration */}
            <div className="flex items-end justify-center space-x-2">
              {/* Left column */}
              <div className="relative">
                <div className="w-4 h-12 bg-gray-300 rounded-sm"></div>
                <div className="w-6 h-2 bg-gray-400 rounded-sm -mt-1 -ml-1"></div>
                <div className="w-6 h-1 bg-gray-500 rounded-sm -mt-0.5 -ml-1"></div>
              </div>

              {/* Right column */}
              <div className="relative">
                <div className="w-4 h-16 bg-gray-300 rounded-sm"></div>
                <div className="w-6 h-2 bg-gray-400 rounded-sm -mt-1 -ml-1"></div>
                <div className="w-6 h-1 bg-gray-500 rounded-sm -mt-0.5 -ml-1"></div>
              </div>
            </div>

            {/* Decorative green circle */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-0 -right-1 w-6 h-6 bg-green-300 rounded-full opacity-40"></div>
          </div>
        </div>

        <CardHeader className="pt-16 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Learn Python 3
          </h2>
          <p className="text-gray-600 leading-relaxed text-base">
            Learn the basics of Python 3.12, one of the most powerful,
            versatile, and in-demand programming languages today.
          </p>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          {/* Dotted separator line */}
          <div className="border-t border-dotted border-gray-300 my-6"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Certificate Badge */}
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  With <span className="font-semibold">Certificate</span>
                </span>
              </div>

              {/* Beginner Friendly Badge */}
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  <span className="font-semibold">Beginner</span> Friendly
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-bold text-gray-900">23</span>
              <span className="text-gray-600">hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
