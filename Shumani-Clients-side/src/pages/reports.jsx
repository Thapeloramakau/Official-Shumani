import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./reports.css";

const COLORS = ["#00C49F", "#E0E0E0"];

const Progress = () => {
  // Hardcoded data
  const activeStudentsData = [{ value: 4 }, { value: 1 }];
  const progressPercentageData = [{ value: 65 }, { value: 35 }];
  const modulesCompletedData = [{ value: 11 }, { value: 18 }];

  return (
    <div className="progress-container">
      <h1>Progress Overview</h1>

      <div className="charts-row">
        {/* Card 1 */}
        <div className="chart-card">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={activeStudentsData}
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {activeStudentsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-label">
            <h3>4 / 5</h3>
            <p>Active Students</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="chart-card">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={progressPercentageData}
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {progressPercentageData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-label">
            <h3>65%</h3>
            <p>Overall Progress</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="chart-card">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={modulesCompletedData}
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {modulesCompletedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-label">
            <h3>7 / 21</h3>
            <p>Modules Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
