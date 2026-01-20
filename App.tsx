
import React, { useState, useEffect, useRef } from 'react';
import { User, View, UserRole, HousePhoto, CurimbaFile, CalendarEvent, PontoRequest, Guia } from './types';
import { ADMIN_PHONE, APP_NAME } from './constants';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>(View.PROFILE);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Simulated Databases
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([
    { phone: ADMIN_PHONE, password: '*', name: 'Administrador Principal', role: 'ADMIN' }
  ]);

  const [housePhotos, setHousePhotos] = useState<HousePhoto[]>([]);
  const [curimbaFiles, setCurimbaFiles] = useState<CurimbaFile[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [pontoRequests, setPontoRequests] = useState<PontoRequest[]>([]);
  const [myGuides, setMyGuides] = useState<Guia[]>([]);

  // Auth Form States
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isMedium, setIsMedium] = useState('Não');
  const [guia, setGuia] = useState('');
  const [dirigente, setDirigente] = useState('Mãe Ju');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ponto Request Form States (Members)
  const [pontoNome, setPontoNome] = useState('');
  const [pontoLinha, setPontoLinha] = useState('Direita');
  const [pontoDetalhes, setPontoDetalhes] = useState('');
  const [pontoSentSuccess, setPontoSentSuccess] = useState(false);

  // Meus Guias Form States
  const [newGuiaNome, setNewGuiaNome] = useState('');
  const [newGuiaPonto, setNewGuiaPonto] = useState('');
  const [newGuiaLetra, setNewGuiaLetra] = useState('');

  // Admin Form States
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventGuides, setNewEventGuides] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States para Edição e Exclusão
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<CurimbaFile | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserPhone, setDeletingUserPhone] = useState<string | null>(null);

  // UI States
  const [selectedLetra, setSelectedLetra] = useState<CurimbaFile | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<HousePhoto | null>(null);
  const [selectedGuiaPonto, setSelectedGuiaPonto] = useState<Guia | null>(null);

  // Check if phone exists
  useEffect(() => {
    if (phone.length >= 10) {
      const existing = registeredUsers.find(u => u.phone === phone);
      setIsNewUser(!existing);
    } else {
      setIsNewUser(false);
    }
  }, [phone, registeredUsers]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (phone.length < 10) {
        setError('Celular inválido.');
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError('A senha é obrigatória.');
        setIsLoading(false);
        return;
      }

      const existingUser = registeredUsers.find(u => u.phone === phone);
      
      if (existingUser) {
        if (existingUser.password === password) {
          setUser(existingUser);
          setIsAuthenticated(true);
        } else {
          setError('Senha incorreta.');
        }
      } else {
        if (!name.trim()) {
          setError('Nome é obrigatório para cadastro.');
          setIsLoading(false);
          return;
        }
        const newUser: User = { 
          phone, 
          password, 
          name: name.trim(), 
          role: 'MEMBER', 
          isMedium, 
          guia, 
          dirigente 
        };
        setRegisteredUsers(prev => [...prev, newUser]);
        setUser(newUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 600);
  };

  const handleMemberRequestPonto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pontoNome) return;

    const newRequest: PontoRequest = {
      id: Date.now().toString(),
      nome: pontoNome,
      linha: pontoLinha,
      detalhes: pontoDetalhes,
      solicitante: user?.name || 'Desconhecido',
      data: new Date().toLocaleDateString('pt-BR')
    };

    setPontoRequests(prev => [newRequest, ...prev]);
    setPontoSentSuccess(true);
    
    setTimeout(() => {
      setPontoSentSuccess(false);
      setPontoNome('');
      setPontoLinha('Direita');
      setPontoDetalhes('');
    }, 3000);
  };

  const handleAddGuia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuiaNome || !newGuiaPonto) return;

    const newGuia: Guia = {
      id: Date.now().toString(),
      nome: newGuiaNome,
      pontoNome: newGuiaPonto,
      letra: newGuiaLetra,
      userPhone: user!.phone
    };

    setMyGuides(prev => [...prev, newGuia]);
    setNewGuiaNome('');
    setNewGuiaPonto('');
    setNewGuiaLetra('');
  };

  const handleDeleteGuia = (id: string) => {
    if (window.confirm('Deseja remover este guia da sua lista?')) {
      setMyGuides(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    const photo: HousePhoto = {
      id: Date.now().toString(),
      url: newPhotoUrl,
      description: newPhotoDesc,
      date: new Date().toISOString().split('T')[0]
    };
    setHousePhotos(prev => [photo, ...prev]);
    setNewPhotoUrl('');
    setNewPhotoDesc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDeletePhoto = (id: string) => {
    setHousePhotos(prev => prev.filter(p => p.id !== id));
    setDeletingPhotoId(null);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle || !newFileContent) return;
    const file: CurimbaFile = {
      id: Date.now().toString(),
      title: newFileTitle,
      content: newFileContent,
      date: new Date().toISOString().split('T')[0]
    };
    setCurimbaFiles(prev => [file, ...prev]);
    setNewFileTitle('');
    setNewFileContent('');
  };

  const handleSaveEditFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;
    setCurimbaFiles(prev => prev.map(f => f.id === editingFile.id ? editingFile : f));
    setEditingFile(null);
  };

  const confirmDeleteFile = (id: string) => {
    setCurimbaFiles(prev => prev.filter(f => f.id !== id));
    setDeletingFileId(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: newEventDate,
      description: newEventDesc,
      workingGuides: newEventGuides
    };
    setCalendarEvents(prev => [...prev, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventGuides('');
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setCalendarEvents(prev => prev.map(ev => ev.id === editingEvent.id ? editingEvent : ev).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setEditingEvent(null);
  };

  const confirmDeleteEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(ev => ev.id !== id));
    setDeletingEventId(null);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setRegisteredUsers(prev => prev.map(u => u.phone === editingUser.phone ? editingUser : u));
    if (user?.phone === editingUser.phone) setUser(editingUser);
    setEditingUser(null);
  };

  const confirmDeleteUser = (phone: string) => {
    if (phone === user?.phone) {
        alert("Você não pode excluir a sua própria conta de administrador.");
        setDeletingUserPhone(null);
        return;
    }
    setRegisteredUsers(prev => prev.filter(u => u.phone !== phone));
    setDeletingUserPhone(null);
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm('Deseja remover esta solicitação de ponto?')) {
      setPontoRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPhone('');
    setPassword('');
    setActiveView(View.PROFILE);
  };

  const getGuideOwnerName = (ownerPhone: string) => {
    const owner = registeredUsers.find(u => u.phone === ownerPhone);
    return owner ? owner.name : 'Membro Desconhecido';
  };

  // Estatísticas de Membros por Dirigente
  const dirigentesList = ['Mãe Ju', 'Mãe Izabel', 'Pai Fábio', 'Pai Erick'];
  const getCountByDirigente = (dirigente: string) => {
    return registeredUsers.filter(u => u.dirigente === dirigente && u.role === 'MEMBER').length;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-900 rounded-2xl text-white text-3xl shadow-lg mb-4">
              <i className="fas fa-user-lock"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{APP_NAME}</h1>
            <p className="mt-2 text-gray-600 font-medium">Área de Membros</p>
          </div>

          <div className="bg-white py-10 px-8 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Celular</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="DDD + Número"
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none transition-all text-sm"
                  />
                </div>

                {phone.length >= 10 && (
                  <div className="animate-fade-in-down space-y-4">
                    {isNewUser ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu Nome Completo"
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">É Médium?</label>
                            <select 
                              value={isMedium} 
                              onChange={(e) => setIsMedium(e.target.value)} 
                              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-900 outline-none"
                            >
                              <option value="Não">Não</option>
                              <option value="Sim">Sim</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dirigente</label>
                            <select 
                              value={dirigente} 
                              onChange={(e) => setDirigente(e.target.value)} 
                              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-amber-900 outline-none"
                            >
                              <option value="Mãe Ju">Mãe Ju</option>
                              <option value="Mãe Izabel">Mãe Izabel</option>
                              <option value="Pai Fábio">Pai Fábio</option>
                              <option value="Pai Erick">Pai Erick</option>
                            </select>
                          </div>
                        </div>
                        {isMedium === 'Sim' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sua Guia</label>
                            <input 
                              type="text" 
                              required 
                              value={guia} 
                              onChange={(e) => setGuia(e.target.value)} 
                              placeholder="Qual sua guia principal?" 
                              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-900" 
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Escolha uma Senha</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Digite sua senha"
                          className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-900 outline-none text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg animate-pulse">{error}</div>}

              <button 
                type="submit" 
                disabled={isLoading || phone.length < 10} 
                className="w-full flex justify-center py-4 bg-amber-900 hover:bg-amber-950 rounded-xl shadow-lg text-sm font-bold text-white transition-all disabled:opacity-50"
              >
                {isLoading ? <i className="fas fa-spinner animate-spin"></i> : (isNewUser ? 'Criar Minha Conta' : 'Acessar Área de Membros')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeView={activeView} setView={setActiveView} user={user} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between md:hidden">
          <div className="flex items-center space-x-2 font-bold text-gray-800">
             <i className="fas fa-crown text-amber-900 mr-1"></i> {APP_NAME}
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500 hover:text-amber-900"><i className="fas fa-bars text-xl"></i></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            {activeView === View.PROFILE && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.name.split(' ')[0]}!</h1>
                  <p className="text-gray-500">Sua conta exclusiva do {APP_NAME}.</p>
                </header>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                  <div className="w-24 h-24 bg-amber-50 text-amber-900 rounded-full mx-auto flex items-center justify-center text-4xl mb-4"><i className="fas fa-user-circle"></i></div>
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                  <p className="text-gray-500 font-mono text-sm">{user?.phone}</p>
                  <div className={`mt-4 inline-flex px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user?.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-600'}`}>
                    {user?.role}
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Médium</p>
                        <p className="text-sm font-semibold text-gray-700">{user?.isMedium}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Dirigente</p>
                        <p className="text-sm font-semibold text-gray-700">{user?.dirigente}</p>
                    </div>
                    {user?.guia && (
                        <div className="col-span-2 p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Guia de Trabalho</p>
                            <p className="text-sm font-semibold text-gray-700">{user?.guia}</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === View.MANAGE_MEMBERS && user?.role === 'ADMIN' && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Gerenciar Membros</h1>
                  <p className="text-gray-500">Administre as contas dos membros cadastrados no {APP_NAME}.</p>
                </header>

                {/* Resumo por Dirigente */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dirigentesList.map(d => (
                    <div key={d} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-gray-400 uppercase mb-1">{d}</span>
                      <span className="text-2xl font-black text-amber-900">{getCountByDirigente(d)}</span>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase">Membros</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nome / Celular</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Cargo</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Dirigente</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {registeredUsers.map(u => (
                          <tr key={u.phone} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-800">{u.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{u.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-700'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{u.dirigente || '---'}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => setEditingUser(u)}
                                  className="w-9 h-9 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center hover:bg-amber-100 transition-colors"
                                  title="Editar Membro"
                                >
                                  <i className="fas fa-user-edit"></i>
                                </button>
                                {deletingUserPhone === u.phone ? (
                                  <div className="flex space-x-1 animate-fade-in">
                                    <button onClick={() => confirmDeleteUser(u.phone)} className="bg-red-600 text-white text-[8px] font-bold px-2 py-1.5 rounded-lg shadow-sm">SIM</button>
                                    <button onClick={() => setDeletingUserPhone(null)} className="bg-gray-800 text-white text-[8px] font-bold px-2 py-1.5 rounded-lg shadow-sm">NÃO</button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setDeletingUserPhone(u.phone)}
                                    className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                                    title="Excluir Membro"
                                    disabled={u.phone === user.phone}
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit User Modal */}
                {editingUser && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-down">
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50">
                        <h2 className="text-xl font-bold text-gray-800">Editar Membro</h2>
                        <button type="button" onClick={() => setEditingUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-100 text-gray-400 transition-colors">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <form onSubmit={handleSaveEditUser} className="p-8 space-y-5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase px-1">Nome Completo</label>
                          <input 
                            type="text" 
                            value={editingUser.name} 
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" 
                            required 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase px-1">Perfil / Role</label>
                            <select 
                              value={editingUser.role} 
                              onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-amber-900"
                            >
                              <option value="MEMBER">Membro</option>
                              <option value="ADMIN">Administrador</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase px-1">Dirigente</label>
                            <select 
                              value={editingUser.dirigente} 
                              onChange={(e) => setEditingUser({...editingUser, dirigente: e.target.value})} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-amber-900"
                            >
                              <option value="Mãe Ju">Mãe Ju</option>
                              <option value="Mãe Izabel">Mãe Izabel</option>
                              <option value="Pai Fábio">Pai Fábio</option>
                              <option value="Pai Erick">Pai Erick</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase px-1">Médium?</label>
                            <select 
                              value={editingUser.isMedium} 
                              onChange={(e) => setEditingUser({...editingUser, isMedium: e.target.value})} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-amber-900"
                            >
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase px-1">Guia Principal</label>
                            <input 
                              type="text" 
                              value={editingUser.guia || ''} 
                              onChange={(e) => setEditingUser({...editingUser, guia: e.target.value})} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" 
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                          <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Cancelar</button>
                          <button type="submit" className="px-10 py-3 bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-amber-950 transition-colors">Salvar Alterações</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === View.MY_GUIDES && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Meus Guias</h1>
                  <p className="text-gray-500">
                    {user?.role === 'ADMIN' 
                      ? 'Visualize todos os guias cadastrados pelos membros da curimba.' 
                      : 'Gerencie seus guias espirituais e seus pontos favoritos.'}
                  </p>
                </header>

                {/* Formulário de cadastro - apenas para Membros */}
                {user?.role === 'MEMBER' && (
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                    <h2 className="text-sm font-bold text-amber-900 mb-4 uppercase tracking-wider"><i className="fas fa-plus mr-2"></i>Cadastrar Guia</h2>
                    <form onSubmit={handleAddGuia} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-amber-800 uppercase px-1">Nome do Guia</label>
                          <input 
                            type="text" 
                            value={newGuiaNome} 
                            onChange={(e) => setNewGuiaNome(e.target.value)} 
                            placeholder="Ex: Caboclo Sete Flechas" 
                            className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" 
                            required 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-amber-800 uppercase px-1">Ponto de Chamada / Favorito</label>
                          <input 
                            type="text" 
                            value={newGuiaPonto} 
                            onChange={(e) => setNewGuiaPonto(e.target.value)} 
                            placeholder="Ex: Ponto de Abertura" 
                            className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-800 uppercase px-1">Letra do Ponto</label>
                        <textarea 
                          value={newGuiaLetra} 
                          onChange={(e) => setNewGuiaLetra(e.target.value)} 
                          rows={4} 
                          placeholder="Digite a letra completa do ponto aqui..." 
                          className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                        ></textarea>
                      </div>
                      <button type="submit" className="bg-amber-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-950 transition-all shadow-md">
                        Salvar Guia
                      </button>
                    </form>
                  </div>
                )}

                {/* Listagem de guias */}
                <div className="grid grid-cols-1 gap-4">
                  {(user?.role === 'ADMIN' ? myGuides : myGuides.filter(g => g.userPhone === user?.phone)).length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-400">
                        {user?.role === 'ADMIN' ? 'Nenhum guia cadastrado no sistema.' : 'Você ainda não cadastrou nenhum guia.'}
                      </p>
                    </div>
                  ) : (
                    (user?.role === 'ADMIN' ? myGuides : myGuides.filter(g => g.userPhone === user?.phone)).map(guide => (
                      <div key={guide.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                            <i className="fas fa-hand-holding-heart"></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{guide.nome}</h3>
                            <p className="text-sm text-amber-700 font-semibold">{guide.pontoNome}</p>
                            {user?.role === 'ADMIN' && (
                              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                                <i className="fas fa-user mr-1"></i> Membro: {getGuideOwnerName(guide.userPhone)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            type="button"
                            onClick={() => setSelectedGuiaPonto(guide)}
                            className="px-4 py-2 bg-amber-50 text-amber-900 rounded-xl font-bold text-xs hover:bg-amber-100 transition-colors"
                          >
                            VER LETRA
                          </button>
                          {(user?.role === 'ADMIN' || guide.userPhone === user?.phone) && (
                            <button 
                              type="button"
                              onClick={() => handleDeleteGuia(guide.id)}
                              className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                              title="Remover Guia"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Guia Letra Modal */}
                {selectedGuiaPonto && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedGuiaPonto(null)}>
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{selectedGuiaPonto.nome}</h2>
                          <p className="text-xs text-amber-700 font-bold uppercase">{selectedGuiaPonto.pontoNome}</p>
                          {user?.role === 'ADMIN' && (
                             <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Membro: {getGuideOwnerName(selectedGuiaPonto.userPhone)}</p>
                          )}
                        </div>
                        <button type="button" onClick={() => setSelectedGuiaPonto(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-amber-100 text-gray-400 transition-colors">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="p-8 max-h-[60vh] overflow-y-auto bg-white">
                        {selectedGuiaPonto.letra ? (
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm italic">
                            {selectedGuiaPonto.letra}
                          </pre>
                        ) : (
                          <p className="text-gray-400 text-center italic">Nenhuma letra cadastrada para este ponto.</p>
                        )}
                      </div>
                      <div className="p-4 border-t border-gray-100 text-center bg-gray-50">
                        <button type="button" onClick={() => setSelectedGuiaPonto(null)} className="px-10 py-3 bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md">Fechar</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === View.REQUEST_PONTO && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.role === 'ADMIN' ? 'Pontos Solicitados' : 'Pedir um Ponto'}
                  </h1>
                  <p className="text-gray-500">
                    {user?.role === 'ADMIN' 
                      ? 'Visualize os pontos que os membros estão solicitando para a curimba.' 
                      : 'Solicite um ponto específico para a curimba tocar na gira.'}
                  </p>
                </header>

                {user?.role === 'ADMIN' ? (
                  <div className="space-y-4">
                    {pontoRequests.length === 0 ? (
                      <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                        <p className="text-gray-400">Nenhuma solicitação de ponto encontrada.</p>
                      </div>
                    ) : (
                      pontoRequests.map(req => (
                        <div key={req.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-gray-800 text-lg">{req.nome}</h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.linha === 'Direita' ? 'bg-amber-100 text-amber-900' : 'bg-red-50 text-red-600'}`}>
                                {req.linha}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 italic mb-2">"{req.detalhes}"</p>
                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest space-x-4">
                              <span><i className="fas fa-user mr-1"></i> {req.solicitante}</span>
                              <span><i className="fas fa-calendar mr-1"></i> {req.data}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Remover solicitação"
                          >
                            <i className="fas fa-trash-alt text-lg"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <form onSubmit={handleMemberRequestPonto} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Ponto</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Ponto de Caboclo" 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-900" 
                            required 
                            value={pontoNome}
                            onChange={(e) => setPontoNome(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Linha</label>
                          <select 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-amber-900"
                            value={pontoLinha}
                            onChange={(e) => setPontoLinha(e.target.value)}
                          >
                            <option value="Direita">Direita</option>
                            <option value="Esquerda">Esquerda</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detalhes ou Letra</label>
                        <textarea 
                          rows={4} 
                          placeholder="Digite a letra ou detalhes para a curimba identificar o ponto..." 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-amber-900"
                          value={pontoDetalhes}
                          onChange={(e) => setPontoDetalhes(e.target.value)}
                        ></textarea>
                      </div>
                      <button type="submit" className="px-8 py-4 bg-amber-900 text-white font-bold rounded-xl shadow-lg hover:bg-amber-950 transition-all flex items-center">
                        <i className="fas fa-paper-plane mr-2"></i> Enviar Solicitação
                      </button>
                      {pontoSentSuccess && <p className="text-emerald-600 font-bold animate-pulse mt-2">Sua solicitação foi enviada com sucesso!</p>}
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeView === View.HOUSE_PHOTOS && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Fotos da Casa</h1>
                  <p className="text-gray-500">Registros especiais do nosso terreiro. Clique na foto para ampliar.</p>
                </header>

                {user?.role === 'ADMIN' && (
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                    <h2 className="text-sm font-bold text-amber-900 mb-4 uppercase tracking-wider"><i className="fas fa-plus mr-2"></i>Postar Nova Foto</h2>
                    <form onSubmit={handleAddPhoto} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-amber-400 uppercase tracking-tighter">Escolha do Dispositivo</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-900 file:text-white hover:file:bg-amber-950 cursor-pointer" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-amber-400 uppercase tracking-tighter">Ou cole a URL</label>
                          <input 
                            type="text" 
                            value={newPhotoUrl} 
                            onChange={(e) => setNewPhotoUrl(e.target.value)} 
                            placeholder="https://..." 
                            className="w-full px-4 py-2 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" 
                          />
                        </div>
                      </div>
                      
                      {newPhotoUrl && (
                        <div className="mt-2 relative inline-block">
                           <img src={newPhotoUrl} className="w-32 h-20 object-cover rounded-lg border-2 border-white shadow-sm" alt="Preview" />
                           <button type="button" onClick={() => setNewPhotoUrl('')} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-md"><i className="fas fa-times"></i></button>
                        </div>
                      )}

                      <input type="text" value={newPhotoDesc} onChange={(e) => setNewPhotoDesc(e.target.value)} placeholder="Breve descrição da foto" className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" />
                      <button type="submit" disabled={!newPhotoUrl} className="w-full md:w-auto bg-amber-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-950 transition-all disabled:opacity-50">Postar Foto</button>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {housePhotos.length === 0 ? (
                    <div className="md:col-span-2 bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-400">Nenhuma foto postada ainda.</p>
                    </div>
                  ) : (
                    housePhotos.map(photo => (
                      <div 
                        key={photo.id} 
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group relative cursor-zoom-in"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <div className="h-64 overflow-hidden relative">
                          <img src={photo.url} alt={photo.description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm z-10">{photo.date}</div>
                          
                          {user?.role === 'ADMIN' && (
                            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end space-y-2">
                              {deletingPhotoId === photo.id ? (
                                <div className="flex space-x-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    type="button"
                                    onClick={() => confirmDeletePhoto(photo.id)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-xl text-[10px] font-bold shadow-xl active:scale-95"
                                  >
                                    CONFIRMAR?
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setDeletingPhotoId(null)}
                                    className="px-3 py-2 bg-gray-800 text-white rounded-xl text-[10px] font-bold shadow-xl active:scale-95"
                                  >
                                    CANCELAR
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingPhotoId(photo.id);
                                  }}
                                  className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90"
                                  title="Excluir foto"
                                >
                                  <i className="fas fa-trash-alt text-lg"></i>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="font-semibold text-gray-800">{photo.description || 'Sem descrição'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedPhoto && (
                  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedPhoto(null)}>
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button" 
                        onClick={() => setSelectedPhoto(null)} 
                        className="absolute top-0 right-0 m-4 md:-right-12 md:top-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[80]"
                      >
                        <i className="fas fa-times text-xl"></i>
                      </button>
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src={selectedPhoto.url} 
                          alt={selectedPhoto.description} 
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in-down"
                        />
                      </div>
                      <div className="mt-4 text-center max-w-2xl px-6">
                        <h2 className="text-xl font-bold text-white mb-1">{selectedPhoto.description || 'Nossa Casa'}</h2>
                        <p className="text-sm text-gray-400 font-medium">{selectedPhoto.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === View.CURIMBA_ARCHIVES && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Arquivos Curimba</h1>
                  <p className="text-gray-500">Letras de música e guias de estudo.</p>
                </header>

                {user?.role === 'ADMIN' && (
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                    <h2 className="text-sm font-bold text-amber-900 mb-4 uppercase tracking-wider"><i className="fas fa-file-upload mr-2"></i>Adicionar Letra</h2>
                    <form onSubmit={handleAddFile} className="space-y-4">
                      <input type="text" value={newFileTitle} onChange={(e) => setNewFileTitle(e.target.value)} placeholder="Título da Letra / Ponto" className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" required />
                      <textarea value={newFileContent} onChange={(e) => setNewFileContent(e.target.value)} rows={4} placeholder="Digite a letra completa aqui..." className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner resize-none outline-none focus:ring-2 focus:ring-amber-900" required></textarea>
                      <button type="submit" className="bg-amber-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-950 transition-all">Publicar Letra</button>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {curimbaFiles.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-400">Nenhum arquivo ou letra disponível.</p>
                    </div>
                  ) : (
                    curimbaFiles.map(file => (
                      <div key={file.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl">
                            <i className="fas fa-file-lines"></i>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{file.title}</h3>
                            <p className="text-[11px] text-gray-400 uppercase font-semibold">Postado em {file.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => setSelectedLetra(file)} className="w-10 h-10 bg-amber-50 text-amber-900 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"><i className="fas fa-eye"></i></button>
                          {user?.role === 'ADMIN' && (
                            <>
                              <button type="button" onClick={() => setEditingFile(file)} className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"><i className="fas fa-edit"></i></button>
                              {deletingFileId === file.id ? (
                                <div className="flex space-x-1 animate-fade-in">
                                  <button onClick={() => confirmDeleteFile(file.id)} className="bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded">SIM</button>
                                  <button onClick={() => setDeletingFileId(null)} className="bg-gray-800 text-white text-[8px] font-bold px-2 py-1 rounded">NÃO</button>
                                </div>
                              ) : (
                                <button type="button" onClick={() => setDeletingFileId(file.id)} className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"><i className="fas fa-trash-alt"></i></button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedLetra && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedLetra(null)}>
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">{selectedLetra.title}</h2>
                        <button type="button" onClick={() => setSelectedLetra(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50/50">
                        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">{selectedLetra.content}</pre>
                      </div>
                      <div className="p-4 border-t border-gray-100 text-center">
                        <button type="button" onClick={() => setSelectedLetra(null)} className="px-10 py-3 bg-amber-900 text-white rounded-xl font-bold text-sm">Fechar</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === View.CALENDAR && (
              <div className="space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-800">Calendário de Giras</h1>
                  <p className="text-gray-500">Acompanhe os dias e horários dos nossos trabalhos.</p>
                </header>

                {user?.role === 'ADMIN' && (
                  <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                    <h2 className="text-sm font-bold text-amber-900 mb-4 uppercase tracking-wider"><i className="fas fa-calendar-plus mr-2"></i>Agendar Nova Gira</h2>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Nome da Gira" className="px-4 py-3 border border-white rounded-xl text-sm shadow-inner outline-none focus:ring-2 focus:ring-amber-900" required />
                        <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="px-4 py-3 border border-white rounded-xl text-sm shadow-inner bg-white outline-none focus:ring-2 focus:ring-amber-900" required />
                      </div>
                      <textarea value={newEventGuides} onChange={(e) => setNewEventGuides(e.target.value)} rows={1} placeholder="Guias que trabalham (opcional)" className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner resize-none outline-none focus:ring-2 focus:ring-amber-900"></textarea>
                      <textarea value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} rows={2} placeholder="Descrição ou observações..." className="w-full px-4 py-3 border border-white rounded-xl text-sm shadow-inner resize-none outline-none focus:ring-2 focus:ring-amber-900"></textarea>
                      <button type="submit" className="bg-amber-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-950 transition-all">Agendar Gira</button>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {calendarEvents.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-400">Nenhuma gira agendada no momento.</p>
                    </div>
                  ) : (
                    calendarEvents.map(event => {
                      const eventDate = new Date(event.date + 'T00:00:00');
                      const day = eventDate.getDate();
                      const month = eventDate.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
                      const fullDate = eventDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                      return (
                        <div key={event.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
                          <div className="flex-shrink-0 w-16 h-16 bg-amber-900 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-amber-100">
                            <span className="text-xl font-bold leading-none">{day}</span>
                            <span className="text-[10px] font-bold uppercase">{month}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{event.title}</h3>
                            <p className="text-xs text-amber-700 font-semibold mb-1 capitalize">{fullDate}</p>
                            {event.workingGuides && (
                              <p className="text-xs font-bold text-amber-900 mb-1">
                                <i className="fas fa-hand-sparkles mr-1"></i> Trabalham: {event.workingGuides}
                              </p>
                            )}
                            {event.description && <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>}
                          </div>
                          {user?.role === 'ADMIN' && (
                            <div className="flex items-center space-x-2">
                                <button type="button" onClick={() => setEditingEvent(event)} className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"><i className="fas fa-edit"></i></button>
                                {deletingEventId === event.id ? (
                                  <div className="flex space-x-1 animate-fade-in">
                                    <button onClick={() => confirmDeleteEvent(event.id)} className="bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded">SIM</button>
                                    <button onClick={() => setDeletingEventId(null)} className="bg-gray-800 text-white text-[8px] font-bold px-2 py-1 rounded">NÃO</button>
                                  </div>
                                ) : (
                                  <button type="button" onClick={() => setDeletingEventId(event.id)} className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"><i className="fas fa-trash-alt"></i></button>
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Edit Event Modal */}
                {editingEvent && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-down">
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Editar Gira</h2>
                        <button type="button" onClick={() => setEditingEvent(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <form onSubmit={handleSaveEditEvent} className="p-8 space-y-4 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Nome da Gira</label>
                                <input 
                                  type="text" 
                                  value={editingEvent.title} 
                                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} 
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner" 
                                  required 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Data</label>
                                <input 
                                  type="date" 
                                  value={editingEvent.date} 
                                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} 
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner bg-white" 
                                  required 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Guias que trabalham</label>
                            <input 
                              type="text" 
                              value={editingEvent.workingGuides || ''} 
                              onChange={(e) => setEditingEvent({...editingEvent, workingGuides: e.target.value})} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Descrição</label>
                            <textarea 
                              value={editingEvent.description || ''} 
                              onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} 
                              rows={3} 
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm shadow-inner resize-none" 
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button type="button" onClick={() => setEditingEvent(null)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm">Cancelar</button>
                          <button type="submit" className="px-10 py-3 bg-amber-900 text-white rounded-xl font-bold text-sm">Salvar Gira</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
