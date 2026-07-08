const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// ==============================
// Banco de dados em memória
// ==============================

let clients = [];
let appointments = [];

let clientId = 1;
let appointmentId = 1;

// ==============================
// Rota inicial
// ==============================

app.get("/", (req, res) => {
    res.json({
        message: "API Barbearia funcionando!"
    });
});

// ==============================
// CLIENTES
// ==============================

// Listar clientes
app.get("/clients", (req, res) => {
    res.json(clients);
});

// Buscar cliente por ID
app.get("/clients/:id", (req, res) => {
    const id = Number(req.params.id);

    const client = clients.find(c => c.id === id);

    if (!client) {
        return res.status(404).json({
            error: "Cliente não encontrado."
        });
    }

    res.json(client);
});

// Criar cliente
app.post("/clients", (req, res) => {

    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            error: "Nome e telefone são obrigatórios."
        });
    }

    const exists = clients.find(c => c.phone === phone);

    if (exists) {
        return res.status(400).json({
            error: "Telefone já cadastrado."
        });
    }

    const client = {
        id: clientId++,
        name,
        phone
    };

    clients.push(client);

    res.status(201).json(client);

});

// Atualizar cliente
app.put("/clients/:id", (req, res) => {

    const id = Number(req.params.id);

    const client = clients.find(c => c.id === id);

    if (!client) {
        return res.status(404).json({
            error: "Cliente não encontrado."
        });
    }

    const { name, phone } = req.body;

    if (name) client.name = name;
    if (phone) client.phone = phone;

    res.json(client);

});

// Excluir cliente
app.delete("/clients/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = clients.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Cliente não encontrado."
        });
    }

    appointments = appointments.filter(a => a.clientId !== id);

    clients.splice(index, 1);

    res.json({
        message: "Cliente removido."
    });

});

// ==============================
// AGENDAMENTOS
// ==============================

// Listar todos
app.get("/appointments", (req, res) => {

    const result = appointments.map(app => {

        const client = clients.find(c => c.id === app.clientId);

        return {
            ...app,
            client
        };

    });

    res.json(result);

});

// Buscar por ID
app.get("/appointments/:id", (req, res) => {

    const id = Number(req.params.id);

    const appointment = appointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({
            error: "Agendamento não encontrado."
        });
    }

    const client = clients.find(c => c.id === appointment.clientId);

    res.json({
        ...appointment,
        client
    });

});

// Criar agendamento
app.post("/appointments", (req, res) => {

    const {
        clientId,
        service,
        date,
        time
    } = req.body;

    if (!clientId || !service || !date || !time) {
        return res.status(400).json({
            error: "Todos os campos são obrigatórios."
        });
    }

    const client = clients.find(c => c.id === clientId);

    if (!client) {
        return res.status(404).json({
            error: "Cliente não encontrado."
        });
    }

    // Regra:
    // Não permitir dois agendamentos
    // no mesmo dia e horário.

    const conflict = appointments.find(a =>
        a.date === date &&
        a.time === time
    );

    if (conflict) {
        return res.status(400).json({
            error: "Horário já está ocupado."
        });
    }

    const appointment = {
        id: appointmentId++,
        clientId,
        service,
        date,
        time
    };

    appointments.push(appointment);

    res.status(201).json(appointment);

});

// Atualizar agendamento
app.put("/appointments/:id", (req, res) => {

    const id = Number(req.params.id);

    const appointment = appointments.find(a => a.id === id);

    if (!appointment) {
        return res.status(404).json({
            error: "Agendamento não encontrado."
        });
    }

    const {
        clientId,
        service,
        date,
        time
    } = req.body;

    if (clientId) {

        const client = clients.find(c => c.id === clientId);

        if (!client) {
            return res.status(404).json({
                error: "Cliente não encontrado."
            });
        }

        appointment.clientId = clientId;
    }

    if (date || time) {

        const newDate = date || appointment.date;
        const newTime = time || appointment.time;

        const conflict = appointments.find(a =>
            a.id !== id &&
            a.date === newDate &&
            a.time === newTime
        );

        if (conflict) {
            return res.status(400).json({
                error: "Horário já está ocupado."
            });
        }

        appointment.date = newDate;
        appointment.time = newTime;
    }

    if (service) {
        appointment.service = service;
    }

    res.json(appointment);

});

// Excluir agendamento
app.delete("/appointments/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = appointments.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Agendamento não encontrado."
        });
    }

    appointments.splice(index, 1);

    res.json({
        message: "Agendamento removido."
    });

});

// ==============================
// Servidor
// ==============================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
