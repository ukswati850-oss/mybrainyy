import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { format, subDays } from 'date-fns';

export const Analytics = () => {
  const { tasks, habits, stats, preferences } = useStore();

  // Prepare data for charts
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  
  // Mock weekly activity data since we don't have full history in this MVP store
  const weeklyActivityData = [
    { day: 'Mon', focus: 45, tasks: 3 },
    { day: 'Tue', focus: 60, tasks: 5 },
    { day: 'Wed', focus: 30, tasks: 2 },
    { day: 'Thu', focus: 90, tasks: 6 },
    { day: 'Fri', focus: 120, tasks: 8 },
    { day: 'Sat', focus: 0, tasks: 1 },
    { day: 'Sun', focus: 20, tasks: 2 },
  ];

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%', left: 'center' },
    color: ['#0ea5e9', '#cbd5e1'],
    series: [
      {
        name: 'Tasks',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        data: [
          { value: completedTasks, name: 'Completed' },
          { value: pendingTasks, name: 'Pending' },
        ]
      }
    ]
  };

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: weeklyActivityData.map(d => d.day),
      axisLine: { lineStyle: { color: '#94a3b8' } }
    },
    yAxis: { 
      type: 'value',
      axisLine: { lineStyle: { color: '#94a3b8' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } }
    },
    series: [
      {
        name: 'Focus Minutes',
        type: 'bar',
        data: weeklyActivityData.map(d => d.focus),
        itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] },
        barWidth: '40%'
      }
    ]
  };

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productivity Analytics</h1>
        <p className="text-slate-500">Data-driven insights for a better you.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: stats.xp, color: 'text-yellow-500' },
          { label: 'Level', value: stats.level, color: 'text-primary-500' },
          { label: 'Focus Hours', value: (stats.focusMinutes / 60).toFixed(1), color: 'text-purple-500' },
          { label: 'Tasks Done', value: stats.tasksCompleted, color: 'text-green-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Task Completion</h3>
          <ReactECharts option={pieOption} style={{ height: '300px' }} theme={isDark ? 'dark' : undefined} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Focus Activity (Last 7 Days)</h3>
          <ReactECharts option={barOption} style={{ height: '300px' }} theme={isDark ? 'dark' : undefined} />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Habit Consistency</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="font-medium text-slate-700 dark:text-slate-300">{habit.title}</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-sm ${i < (habit.streak % 6) ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} 
                  />
                ))}
              </div>
            </div>
          ))}
          {habits.length === 0 && <p className="text-slate-400 text-sm">No habits tracked yet.</p>}
        </div>
      </Card>
    </div>
  );
};
