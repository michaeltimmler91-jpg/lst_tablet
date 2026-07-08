local tabletOpen = false
local tabletObj = nil

local TABLET_ANIM_DICT = 'amb@world_human_seat_wall_tablet@female@base'
local TABLET_ANIM_NAME = 'base'
local TABLET_MODEL = 'prop_cs_tablet'

local function loadAnimDict(dict)
    RequestAnimDict(dict)

    while not HasAnimDictLoaded(dict) do
        Wait(10)
    end
end

local function loadModel(model)
    local hash = joaat(model)
    RequestModel(hash)

    while not HasModelLoaded(hash) do
        Wait(10)
    end

    return hash
end

local function showTaxiNotification(title, message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message or '')
    EndTextCommandThefeedPostMessagetext(
        'CHAR_TAXI',
        'CHAR_TAXI',
        false,
        4,
        title or 'Taxi',
        'Los Santos Taxi'
    )
    EndTextCommandThefeedPostTicker(false, false)
end

local function playTabletBing()
    PlaySoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true)
    Wait(80)
    PlaySoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true)
    Wait(80)
    PlaySoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true)
    Wait(80)
    PlaySoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true)
end

local function sendDispatchCard(rideType, pickup, destination, customer)
    print(('[lst_tablet] Dispatch-Karte: %s | %s | %s | %s'):format(
        rideType or '-',
        pickup or '-',
        destination or '-',
        customer or '-'
    ))

    SendNUIMessage({
        action = 'dispatch',
        payload = {
            rideType = rideType or 'Neuer Auftrag',
            pickup = pickup or 'Unbekannt',
            destination = destination or '-',
            customer = customer or '-'
        }
    })
end

local function startTabletAnim()
    local ped = PlayerPedId()

    loadAnimDict(TABLET_ANIM_DICT)

    TaskPlayAnim(
        ped,
        TABLET_ANIM_DICT,
        TABLET_ANIM_NAME,
        8.0,
        -8.0,
        -1,
        49,
        0.0,
        false,
        false,
        false
    )

    local model = loadModel(TABLET_MODEL)
    tabletObj = CreateObject(model, 0.0, 0.0, 0.0, true, true, false)

    AttachEntityToEntity(
        tabletObj,
        ped,
        GetPedBoneIndex(ped, 28422),
        0.0,
        0.0,
        0.03,
        0.0,
        0.0,
        0.0,
        true,
        true,
        false,
        true,
        1,
        true
    )

    SetModelAsNoLongerNeeded(model)
end

local function stopTabletAnim()
    local ped = PlayerPedId()

    ClearPedTasks(ped)

    if tabletObj and DoesEntityExist(tabletObj) then
        DeleteEntity(tabletObj)
    end

    tabletObj = nil
end

local function openTablet()
    if tabletOpen then return end

    tabletOpen = true
    startTabletAnim()

    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)

    SendNUIMessage({
        action = 'open'
    })
end

local function closeTablet()
    if not tabletOpen then return end

    tabletOpen = false
    stopTabletAnim()

    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)

    SendNUIMessage({
        action = 'close'
    })
end

RegisterCommand('taxitablet', function()
    if tabletOpen then
        closeTablet()
    else
        openTablet()
    end
end, false)

RegisterCommand('taxitablettest', function()
    playTabletBing()

    sendDispatchCard(
        'Normale Fahrt',
        'Pillbox Hill',
        'LS Airport',
        'Testkunde'
    )

    showTaxiNotification(
        'Taxi',
        'IC-Sound-Test vom Taxi-Tablet.'
    )
end, false)

RegisterCommand('taxiictest', function()
    playTabletBing()
end, false)

RegisterNUICallback('close', function(_, cb)
    closeTablet()
    cb('ok')
end)

RegisterNUICallback('taxiNewJobAlert', function(data, cb)
    local rideType = data and data.rideType or 'Neuer Auftrag'
    local pickup = data and data.pickup or 'Unbekannt'
    local destination = data and data.destination or '-'
    local customer = data and data.customer or '-'

    print(('[lst_tablet] Neuer Auftrag Callback: %s | %s | %s | %s'):format(
        rideType,
        pickup,
        destination,
        customer
    ))

    playTabletBing()

    SetTimeout(150, function()
        sendDispatchCard(rideType, pickup, destination, customer)
    end)

    cb('ok')
end)

RegisterNUICallback('taxiIdleWarning', function(_, cb)
    playTabletBing()

    showTaxiNotification(
        'Taxi',
        'Deine Sitzung läuft in 2 Minuten ab.\nÖffne das Tablet, um angemeldet zu bleiben.'
    )

    cb('ok')
end)

RegisterNUICallback('taxiIcSoundTest', function(_, cb)
    playTabletBing()
    cb('ok')
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    stopTabletAnim()
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
end)
