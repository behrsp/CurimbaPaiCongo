
import React from 'react';
import { User } from '../types';

const Dashboard: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</h1>
        <p className="text-gray-500">Aqui está o que está acontecendo na sua área de membros hoje.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        {[
          { label: 'Acessos no Mês', value: '1,284', icon: 'fa-eye', color: 'amber' },
          { label: 'Notificações', value: '12', icon: 'fa-bell', color: 'orange' },
          { label: 'Seu Nível', value: user?.role === 'ADMIN' ? 'Administrador' : 'Elite', icon: 'fa-trophy', color: 'stone' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-900`}>
                <i className={`fas ${stat.icon} text-lg`}></i>
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase">Resumo</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Novidades Exclusivas</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4 p-3 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-amber-100">
                <img src={`https://picsum.photos/seed/${i + 10}/80/80`} alt="Update" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">Atualização Premium v.2.4</h4>
                  <p className="text-xs text-gray-500 mt-1">Novas ferramentas de IA foram adicionadas para membros VIP...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {[
              { type: 'Login', time: 'Há 5 minutos', icon: 'fa-sign-in-alt', color: 'amber' },
              { type: 'AI Query', time: 'Há 2 horas', icon: 'fa-robot', color: 'amber' },
              { type: 'Setting Changed', time: 'Ontem', icon: 'fa-cog', color: 'stone' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-sm">
                <div className={`w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700`}>
                  <i className={`fas ${activity.icon} text-xs`}></i>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{activity.type}</span>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
